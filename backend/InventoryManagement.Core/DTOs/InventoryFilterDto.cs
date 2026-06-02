namespace InventoryManagement.Core.DTOs;

public class InventoryFilterDto
{
    public string? Type { get; set; }
    public string? Comment { get; set; }
    public Guid? UserId { get; set; }
    public bool IncludeDeleted { get; set; } = true;
}
