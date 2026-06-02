using Microsoft.EntityFrameworkCore;
using InventoryManagement.Core.Interfaces.Repositories;
using InventoryManagement.Core.Models;
using InventoryManagement.Infrastructure.Data;

namespace InventoryManagement.Infrastructure.Repositories;

public class UserRepository(AppDbContext db) : IUserRepository
{
    public async Task<IEnumerable<User>> GetAllAsync() =>
        await db.Users.OrderBy(u => u.LastName).ToListAsync();

    public async Task<User?> GetByIdAsync(Guid id) =>
        await db.Users.FindAsync(id);

    public async Task<User> AddAsync(User user)
    {
        db.Users.Add(user);
        return user;
    }

    public async Task DeleteAsync(User user) =>
        db.Users.Remove(user);

    public async Task SaveChangesAsync() =>
        await db.SaveChangesAsync();
}
