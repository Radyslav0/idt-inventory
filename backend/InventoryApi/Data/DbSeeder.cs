using InventoryApi.Data;
using InventoryApi.Models;

namespace InventoryApi.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (context.Users.Any()) return;

        var users = new List<User>
        {
            new() { Id = Guid.Parse("11111111-0000-0000-0000-000000000001"), FirstName = "Linas",    LastName = "Petraitis" },
            new() { Id = Guid.Parse("11111111-0000-0000-0000-000000000002"), FirstName = "Rūta",     LastName = "Kazlauskienė" },
            new() { Id = Guid.Parse("11111111-0000-0000-0000-000000000003"), FirstName = "Tomas",    LastName = "Jonaitis" },
            new() { Id = Guid.Parse("11111111-0000-0000-0000-000000000004"), FirstName = "Agnė",     LastName = "Stankevičiūtė" },
        };
        context.Users.AddRange(users);

        var items = new List<InventoryItem>
        {
            new() { Type = ItemType.Laptop,  Comment = "Dell XPS 15, 2023",         PurchaseDate = new DateTime(2023, 3, 15), UserId = users[0].Id },
            new() { Type = ItemType.Phone,   Comment = "Samsung Galaxy S24",         PurchaseDate = new DateTime(2024, 1, 10), UserId = users[0].Id },
            new() { Type = ItemType.Tablet,  Comment = "iPad Pro 12.9",              PurchaseDate = new DateTime(2023, 9, 20), UserId = users[1].Id },
            new() { Type = ItemType.SimCard, Comment = "Tele2 corporate SIM",        PurchaseDate = new DateTime(2022, 6, 1),  UserId = users[1].Id },
            new() { Type = ItemType.Laptop,  Comment = "MacBook Pro M3",             PurchaseDate = new DateTime(2024, 2, 5),  UserId = users[2].Id },
            new() { Type = ItemType.Phone,   Comment = "iPhone 15 Pro",              PurchaseDate = new DateTime(2023, 11, 3), UserId = users[2].Id },
            new() { Type = ItemType.SimCard, Comment = "Bite corporate SIM",         PurchaseDate = new DateTime(2023, 1, 15), UserId = users[3].Id },
            new() { Type = ItemType.Tablet,  Comment = "Samsung Galaxy Tab S9",      PurchaseDate = new DateTime(2023, 8, 22), UserId = users[3].Id },
            new() { Type = ItemType.Laptop,  Comment = "Lenovo ThinkPad X1 Carbon", PurchaseDate = new DateTime(2022, 12, 10), UserId = null },
            new() { Type = ItemType.Phone,   Comment = "Old company phone (retired)", PurchaseDate = new DateTime(2020, 5, 1), UserId = null, IsDeleted = true },
        };
        context.InventoryItems.AddRange(items);
        context.SaveChanges();
    }
}
