using AutoMapper;
using Microsoft.EntityFrameworkCore;
using InventoryApi.Data;
using InventoryApi.DTOs;
using InventoryApi.Models;

namespace InventoryApi.Services;

public class InventoryService : IInventoryService
{
    private readonly AppDbContext _db;
    private readonly IMapper _mapper;

    public InventoryService(AppDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    private IQueryable<InventoryItem> BaseQuery() =>
        _db.InventoryItems.Include(i => i.User);

    public async Task<IEnumerable<InventoryItemDto>> GetAllAsync(InventoryFilterDto filter)
    {
        var query = BaseQuery();

        if (!filter.IncludeDeleted)
            query = query.Where(i => !i.IsDeleted);

        if (!string.IsNullOrWhiteSpace(filter.Type) &&
            Enum.TryParse<ItemType>(filter.Type, true, out var typeEnum))
            query = query.Where(i => i.Type == typeEnum);

        if (!string.IsNullOrWhiteSpace(filter.Comment))
            query = query.Where(i => i.Comment.ToLower().Contains(filter.Comment.ToLower()));

        if (filter.UserId.HasValue)
            query = query.Where(i => i.UserId == filter.UserId);

        var items = await query.OrderByDescending(i => i.PurchaseDate).ToListAsync();
        return _mapper.Map<IEnumerable<InventoryItemDto>>(items);
    }

    public async Task<InventoryItemDto?> GetByIdAsync(Guid id)
    {
        var item = await BaseQuery().FirstOrDefaultAsync(i => i.Id == id);
        return item is null ? null : _mapper.Map<InventoryItemDto>(item);
    }

    public async Task<InventoryItemDto> CreateAsync(CreateInventoryItemDto dto)
    {
        var item = _mapper.Map<InventoryItem>(dto);
        _db.InventoryItems.Add(item);
        await _db.SaveChangesAsync();

        var created = await BaseQuery().FirstAsync(i => i.Id == item.Id);
        return _mapper.Map<InventoryItemDto>(created);
    }

    public async Task<InventoryItemDto?> UpdateAsync(Guid id, UpdateInventoryItemDto dto)
    {
        var item = await BaseQuery().FirstOrDefaultAsync(i => i.Id == id);
        if (item is null) return null;

        _mapper.Map(dto, item);
        await _db.SaveChangesAsync();

        var updated = await BaseQuery().FirstAsync(i => i.Id == id);
        return _mapper.Map<InventoryItemDto>(updated);
    }

    public async Task<bool> SoftDeleteAsync(Guid id)
    {
        var item = await _db.InventoryItems.FindAsync(id);
        if (item is null) return false;

        item.IsDeleted = true;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<InventoryItemDto>> GetForExportAsync(ExportRequestDto request)
    {
        var filter = new InventoryFilterDto(
            request.Type,
            request.Comment,
            request.UserId,
            IncludeDeleted: false
        );
        return await GetAllAsync(filter);
    }
}
