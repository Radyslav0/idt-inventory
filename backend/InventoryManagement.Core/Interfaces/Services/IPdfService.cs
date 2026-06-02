using InventoryManagement.Core.DTOs;

namespace InventoryManagement.Core.Interfaces.Services;

public interface IPdfService
{
    byte[] GeneratePdf(IEnumerable<InventoryItemDto> items, string template);
}
