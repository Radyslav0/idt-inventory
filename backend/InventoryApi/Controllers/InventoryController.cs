using Microsoft.AspNetCore.Mvc;
using InventoryApi.DTOs;
using InventoryApi.Services;
using InventoryApi.PDF;

namespace InventoryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InventoryController : ControllerBase
{
    private readonly IInventoryService _inventoryService;
    private readonly IPdfService _pdfService;

    public InventoryController(IInventoryService inventoryService, IPdfService pdfService)
    {
        _inventoryService = inventoryService;
        _pdfService = pdfService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? type,
        [FromQuery] string? comment,
        [FromQuery] Guid? userId,
        [FromQuery] bool includeDeleted = true)
    {
        var filter = new InventoryFilterDto(type, comment, userId, includeDeleted);
        return Ok(await _inventoryService.GetAllAsync(filter));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var item = await _inventoryService.GetByIdAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateInventoryItemDto dto)
    {
        var created = await _inventoryService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateInventoryItemDto dto)
    {
        var updated = await _inventoryService.UpdateAsync(id, dto);
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> SoftDelete(Guid id)
    {
        var deleted = await _inventoryService.SoftDeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("export")]
    public async Task<IActionResult> Export([FromBody] ExportRequestDto request)
    {
        var items = await _inventoryService.GetForExportAsync(request);
        var pdf = _pdfService.GeneratePdf(items, request.Template);
        return File(pdf, "application/pdf", $"inventory-export-{DateTime.Now:yyyyMMdd-HHmmss}.pdf");
    }
}
