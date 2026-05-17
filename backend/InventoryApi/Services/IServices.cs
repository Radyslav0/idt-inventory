using InventoryApi.DTOs;

namespace InventoryApi.Services;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllAsync();
    Task<UserDto?> GetByIdAsync(Guid id);
    Task<UserDto> CreateAsync(CreateUserDto dto);
    Task<bool> DeleteAsync(Guid id);
}

public interface IInventoryService
{
    Task<IEnumerable<InventoryItemDto>> GetAllAsync(InventoryFilterDto filter);
    Task<InventoryItemDto?> GetByIdAsync(Guid id);
    Task<InventoryItemDto> CreateAsync(CreateInventoryItemDto dto);
    Task<InventoryItemDto?> UpdateAsync(Guid id, UpdateInventoryItemDto dto);
    Task<bool> SoftDeleteAsync(Guid id);
    Task<IEnumerable<InventoryItemDto>> GetForExportAsync(ExportRequestDto request);
}
