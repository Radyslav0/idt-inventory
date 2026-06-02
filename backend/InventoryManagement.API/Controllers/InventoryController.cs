using Microsoft.AspNetCore.Mvc;
using InventoryManagement.Core.DTOs;
using InventoryManagement.Core.Interfaces.Services;

namespace InventoryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InventoryController(IInventoryService inventoryService, IPdfService pdfService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAllAsync(
        [FromQuery] string? type,
        [FromQuery] string? comment,
        [FromQuery] Guid? userId,
        [FromQuery] bool includeDeleted = true)
    {
        var filter = new InventoryFilterDto
        {
            Type = type,
            Comment = comment,
            UserId = userId,
            IncludeDeleted = includeDeleted
        };
        return Ok(await inventoryService.GetAllAsync(filter));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByIdAsync(Guid id)
    {
        var item = await inventoryService.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromBody] CreateInventoryItemDto dto)
    {
        var created = await inventoryService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetByIdAsync), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateAsync(Guid id, [FromBody] UpdateInventoryItemDto dto)
    {
        var updated = await inventoryService.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> SoftDeleteAsync(Guid id)
    {
        var deleted = await inventoryService.SoftDeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("export")]
    public async Task<IActionResult> ExportAsync([FromBody] ExportRequestDto request)
    {
        var items = await inventoryService.GetForExportAsync(request);
        var pdf = pdfService.GeneratePdf(items, request.Template);
        var fileName = $"inventory-export-{DateTime.Now:yyyyMMdd-HHmmss}.pdf";
        return File(pdf, "application/pdf", fileName);
    }
}
