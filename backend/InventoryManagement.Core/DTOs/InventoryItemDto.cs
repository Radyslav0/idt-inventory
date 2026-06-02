namespace InventoryManagement.Core.DTOs;

public class InventoryItemDto
{
    public Guid Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public DateTime PurchaseDate { get; set; }
    public bool IsDeleted { get; set; }
    public Guid? UserId { get; set; }
    public string? UserFullName { get; set; }
}
