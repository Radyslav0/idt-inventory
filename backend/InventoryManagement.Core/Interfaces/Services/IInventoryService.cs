using InventoryManagement.Core.DTOs;

namespace InventoryManagement.Core.Interfaces.Services;

public interface IInventoryService
{
    Task<IEnumerable<InventoryItemDto>> GetAllAsync(InventoryFilterDto filter);
    Task<InventoryItemDto?> GetByIdAsync(Guid id);
    Task<InventoryItemDto> CreateAsync(CreateInventoryItemDto dto);
    Task<InventoryItemDto?> UpdateAsync(Guid id, UpdateInventoryItemDto dto);
    Task<bool> SoftDeleteAsync(Guid id);
    Task<IEnumerable<InventoryItemDto>> GetForExportAsync(ExportRequestDto request);
}
