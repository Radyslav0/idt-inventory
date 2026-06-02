using Microsoft.EntityFrameworkCore;
using InventoryManagement.Core.Models;

namespace InventoryManagement.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<InventoryItem> InventoryItems => Set<InventoryItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<InventoryItem>()
            .HasOne(i => i.User)
            .WithMany(u => u.InventoryItems)
            .HasForeignKey(i => i.UserId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
