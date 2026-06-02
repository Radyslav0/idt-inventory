using InventoryManagement.Core.Models;

namespace InventoryManagement.Core.Interfaces.Repositories;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User?> GetByIdAsync(Guid id);
    Task<User> AddAsync(User user);
    Task DeleteAsync(User user);
    Task SaveChangesAsync();
}
