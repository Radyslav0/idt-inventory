using InventoryManagement.Core.DTOs;

namespace InventoryManagement.Core.Interfaces.Services;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllAsync();
    Task<UserDto?> GetByIdAsync(Guid id);
    Task<UserDto> CreateAsync(CreateUserDto dto);
    Task<bool> DeleteAsync(Guid id);
}
