namespace InventoryManagement.Core.DTOs;

public class ExportRequestDto
{
    public string Template { get; set; } = string.Empty;
    public string? Type { get; set; }
    public string? Comment { get; set; }
    public Guid? UserId { get; set; }
}
