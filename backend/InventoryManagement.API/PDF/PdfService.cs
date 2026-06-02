using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using InventoryManagement.Core.Constants;
using InventoryManagement.Core.DTOs;
using InventoryManagement.Core.Interfaces.Services;

namespace InventoryManagement.API.PDF;

public class PdfService : IPdfService
{
    public byte[] GeneratePdf(IEnumerable<InventoryItemDto> items, string template)
    {
        QuestPDF.Settings.License = LicenseType.Community;
        var itemList = items.ToList();

        return template == PdfTemplates.Template2
            ? GenerateTemplate2(itemList)
            : GenerateTemplate1(itemList);
    }

    // Template 1: Corporate landscape table — dark blue header, alternating rows
    private static byte[] GenerateTemplate1(List<InventoryItemDto> items)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(30);
                page.DefaultTextStyle(x => x.FontFamily("Arial").FontSize(9));

                page.Header().Column(col =>
                {
                    col.Item().Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("INVENTORY REPORT")
                                .FontSize(22).Bold().FontColor(Colors.Blue.Darken3);
                            c.Item().Text("IDT Team — Present Connection UAB")
                                .FontSize(10).FontColor(Colors.Grey.Darken1);
                        });
                        row.ConstantItem(160).AlignRight().Column(c =>
                        {
                            c.Item().Text(DateTime.Now.ToString("MMMM dd, yyyy"))
                                .FontSize(10).FontColor(Colors.Grey.Darken1);
                            c.Item().Text($"Total items: {items.Count}").FontSize(10).Bold();
                        });
                    });
                    col.Item().PaddingTop(5).LineHorizontal(2).LineColor(Colors.Blue.Darken3);
                    col.Item().PaddingBottom(10);
                });

                page.Content().Table(table =>
                {
                    table.ColumnsDefinition(c =>
                    {
                        c.ConstantColumn(30);
                        c.RelativeColumn(2);
                        c.RelativeColumn(4);
                        c.RelativeColumn(3);
                        c.RelativeColumn(2);
                        c.RelativeColumn(3);
                    });

                    table.Header(h =>
                    {
                        static IContainer HeaderCell(IContainer c) =>
                            c.Background(Colors.Blue.Darken3).Padding(6);

                        h.Cell().Element(HeaderCell).Text("#").Bold().FontColor(Colors.White);
                        h.Cell().Element(HeaderCell).Text("Type").Bold().FontColor(Colors.White);
                        h.Cell().Element(HeaderCell).Text("Comment").Bold().FontColor(Colors.White);
                        h.Cell().Element(HeaderCell).Text("Assigned To").Bold().FontColor(Colors.White);
                        h.Cell().Element(HeaderCell).Text("Purchase Date").Bold().FontColor(Colors.White);
                        h.Cell().Element(HeaderCell).Text("Item ID").Bold().FontColor(Colors.White);
                    });

                    for (var i = 0; i < items.Count; i++)
                    {
                        var item = items[i];
                        var bg = i % 2 == 1 ? Colors.Blue.Lighten5 : Colors.White;

                        IContainer Cell(IContainer c) =>
                            c.Background(bg).Padding(5).BorderBottom(0.5f).BorderColor(Colors.Grey.Lighten2);

                        table.Cell().Element(Cell).Text((i + 1).ToString()).FontColor(Colors.Grey.Darken1);
                        table.Cell().Element(Cell).Text(item.Type).Bold();
                        table.Cell().Element(Cell).Text(item.Comment);
                        table.Cell().Element(Cell).Text(item.UserFullName ?? "— Unassigned —")
                            .FontColor(item.UserFullName == null ? Colors.Grey.Medium : Colors.Black);
                        table.Cell().Element(Cell).Text(item.PurchaseDate.ToString("yyyy-MM-dd"));
                        table.Cell().Element(Cell).Text(item.Id.ToString()[..8] + "…")
                            .FontSize(7).FontColor(Colors.Grey.Darken1);
                    }
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("Generated: ").FontSize(8).FontColor(Colors.Grey.Medium);
                    x.Span(DateTime.Now.ToString("yyyy-MM-dd HH:mm")).FontSize(8).FontColor(Colors.Grey.Medium);
                    x.Span("   |   Page ").FontSize(8).FontColor(Colors.Grey.Medium);
                    x.CurrentPageNumber().FontSize(8);
                    x.Span(" of ").FontSize(8).FontColor(Colors.Grey.Medium);
                    x.TotalPages().FontSize(8);
                });
            });
        }).GeneratePdf();
    }

    // Template 2: Portrait cards grouped by user — warm orange style
    private static byte[] GenerateTemplate2(List<InventoryItemDto> items)
    {
        return Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(35);
                page.DefaultTextStyle(x => x.FontFamily("Arial").FontSize(9));

                page.Header().Column(col =>
                {
                    col.Item().Row(row =>
                    {
                        row.RelativeItem().Column(c =>
                        {
                            c.Item().Text("Asset Report")
                                .FontSize(26).Bold().FontColor(Colors.Orange.Darken3);
                            c.Item().Text("Grouped by User  ·  Present Connection UAB")
                                .FontSize(9).FontColor(Colors.Grey.Medium);
                        });
                        row.ConstantItem(120).AlignRight().AlignMiddle()
                            .Background(Colors.Orange.Darken3).Padding(8).AlignCenter()
                            .Text($"{items.Count} items").Bold().FontColor(Colors.White).FontSize(13);
                    });
                    col.Item().PaddingVertical(8).LineHorizontal(1.5f).LineColor(Colors.Orange.Darken3);
                });

                page.Content().Column(col =>
                {
                    var groups = items
                        .GroupBy(i => i.UserFullName ?? "Unassigned")
                        .OrderBy(g => g.Key);

                    foreach (var group in groups)
                    {
                        col.Item().PaddingBottom(14).Column(userBlock =>
                        {
                            userBlock.Item()
                                .Background(Colors.Orange.Lighten4)
                                .Border(1).BorderColor(Colors.Orange.Darken2)
                                .Padding(8).Row(r =>
                                {
                                    r.RelativeItem().Text(group.Key).Bold().FontSize(12);
                                    r.ConstantItem(60).AlignRight()
                                        .Text($"{group.Count()} item{(group.Count() > 1 ? "s" : "")}")
                                        .FontColor(Colors.Orange.Darken3).FontSize(9);
                                });

                            foreach (var item in group)
                            {
                                userBlock.Item()
                                    .Border(0.5f).BorderColor(Colors.Grey.Lighten2)
                                    .BorderLeft(3).BorderColor(GetTypeColor(item.Type))
                                    .PaddingLeft(10).PaddingVertical(6).PaddingRight(8)
                                    .Row(r =>
                                    {
                                        r.RelativeItem(3).Column(c =>
                                        {
                                            c.Item().Text(item.Type).Bold().FontSize(10);
                                            c.Item().Text(item.Comment).FontColor(Colors.Grey.Darken2);
                                        });
                                        r.RelativeItem(2).AlignRight().Column(c =>
                                        {
                                            c.Item().Text(item.PurchaseDate.ToString("yyyy-MM-dd"))
                                                .FontColor(Colors.Grey.Medium).FontSize(8);
                                            c.Item().Text("ID: " + item.Id.ToString()[..8])
                                                .FontColor(Colors.Grey.Lighten1).FontSize(7);
                                        });
                                    });
                            }
                        });
                    }
                });

                page.Footer().AlignCenter().Text(x =>
                {
                    x.Span("IDT Team Inventory Export  |  Page ").FontSize(7).FontColor(Colors.Grey.Medium);
                    x.CurrentPageNumber().FontSize(7);
                    x.Span("/").FontSize(7).FontColor(Colors.Grey.Medium);
                    x.TotalPages().FontSize(7);
                });
            });
        }).GeneratePdf();
    }

    private static string GetTypeColor(string type) => type switch
    {
        ItemTypeNames.Laptop  => Colors.Blue.Medium,
        ItemTypeNames.Phone   => Colors.Green.Medium,
        ItemTypeNames.Tablet  => Colors.Purple.Medium,
        ItemTypeNames.SimCard => Colors.Orange.Medium,
        _                     => Colors.Grey.Medium
    };
}
