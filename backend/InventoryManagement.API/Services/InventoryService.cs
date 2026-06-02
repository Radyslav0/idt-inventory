using AutoMapper;
using InventoryManagement.Core.DTOs;
using InventoryManagement.Core.Interfaces.Repositories;
using InventoryManagement.Core.Interfaces.Services;
using InventoryManagement.Core.Models;

namespace InventoryManagement.API.Services;

public class InventoryService(IInventoryRepository inventoryRepository, IMapper mapper) : IInventoryService
{
    public async Task<IEnumerable<InventoryItemDto>> GetAllAsync(InventoryFilterDto filter)
    {
        var items = await inventoryRepository.GetAllAsync(filter);
        return mapper.Map<IEnumerable<InventoryItemDto>>(items);
    }

    public async Task<InventoryItemDto?> GetByIdAsync(Guid id)
    {
        var item = await inventoryRepository.GetByIdAsync(id);
        return item is null ? null : mapper.Map<InventoryItemDto>(item);
    }

    public async Task<InventoryItemDto> CreateAsync(CreateInventoryItemDto dto)
    {
        var item = mapper.Map<InventoryItem>(dto);
        await inventoryRepository.AddAsync(item);
        await inventoryRepository.SaveChangesAsync();
        var created = await inventoryRepository.GetByIdAsync(item.Id);
        return mapper.Map<InventoryItemDto>(created!);
    }

    public async Task<InventoryItemDto?> UpdateAsync(Guid id, UpdateInventoryItemDto dto)
    {
        var item = await inventoryRepository.GetByIdAsync(id);
        if (item is null) return null;
        mapper.Map(dto, item);
        await inventoryRepository.SaveChangesAsync();
        var updated = await inventoryRepository.GetByIdAsync(id);
        return mapper.Map<InventoryItemDto>(updated!);
    }

    public async Task<bool> SoftDeleteAsync(Guid id)
    {
        var item = await inventoryRepository.GetByIdAsync(id);
        if (item is null) return false;
        item.IsDeleted = true;
        await inventoryRepository.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<InventoryItemDto>> GetForExportAsync(ExportRequestDto request)
    {
        var filter = new InventoryFilterDto
        {
            Type = request.Type,
            Comment = request.Comment,
            UserId = request.UserId,
            IncludeDeleted = false
        };
        return await GetAllAsync(filter);
    }
}
