using InventoryManagement.Core.DTOs;
using InventoryManagement.Core.Models;

namespace InventoryManagement.Core.Interfaces.Repositories;

public interface IInventoryRepository
{
    Task<IEnumerable<InventoryItem>> GetAllAsync(InventoryFilterDto filter);
    Task<InventoryItem?> GetByIdAsync(Guid id);
    Task<InventoryItem> AddAsync(InventoryItem item);
    Task SaveChangesAsync();
}
