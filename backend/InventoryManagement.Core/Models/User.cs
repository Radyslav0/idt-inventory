namespace InventoryManagement.Core.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public ICollection<InventoryItem> InventoryItems { get; set; } = new List<InventoryItem>();
}
