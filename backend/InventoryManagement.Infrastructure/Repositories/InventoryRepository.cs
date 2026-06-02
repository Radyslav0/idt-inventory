using Microsoft.EntityFrameworkCore;
using InventoryManagement.Core.DTOs;
using InventoryManagement.Core.Interfaces.Repositories;
using InventoryManagement.Core.Models;
using InventoryManagement.Infrastructure.Data;

namespace InventoryManagement.Infrastructure.Repositories;

public class InventoryRepository(AppDbContext db) : IInventoryRepository
{
    private IQueryable<InventoryItem> BaseQuery() =>
        db.InventoryItems.Include(i => i.User);

    public async Task<IEnumerable<InventoryItem>> GetAllAsync(InventoryFilterDto filter)
    {
        var query = BaseQuery();

        if (!filter.IncludeDeleted)
            query = query.Where(i => !i.IsDeleted);

        if (!string.IsNullOrWhiteSpace(filter.Type) &&
            Enum.TryParse<ItemType>(filter.Type, ignoreCase: true, out var parsedType))
            query = query.Where(i => i.Type == parsedType);

        if (!string.IsNullOrWhiteSpace(filter.Comment))
            query = query.Where(i => i.Comment.ToLower().Contains(filter.Comment.ToLower()));

        if (filter.UserId.HasValue)
            query = query.Where(i => i.UserId == filter.UserId);

        return await query.OrderByDescending(i => i.PurchaseDate).ToListAsync();
    }

    public async Task<InventoryItem?> GetByIdAsync(Guid id) =>
        await BaseQuery().FirstOrDefaultAsync(i => i.Id == id);

    public async Task<InventoryItem> AddAsync(InventoryItem item)
    {
        db.InventoryItems.Add(item);
        return item;
    }

    public async Task SaveChangesAsync() =>
        await db.SaveChangesAsync();
}
