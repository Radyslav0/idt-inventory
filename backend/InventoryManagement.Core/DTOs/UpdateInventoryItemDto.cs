namespace InventoryManagement.Core.DTOs;

public class UpdateInventoryItemDto
{
    public string Type { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public DateTime PurchaseDate { get; set; }
    public Guid? UserId { get; set; }
}
