namespace InventoryManagement.Core.Models;

public class InventoryItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public ItemType Type { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime PurchaseDate { get; set; }
    public bool IsDeleted { get; set; } = false;
    public Guid? UserId { get; set; }
    public User? User { get; set; }
}
