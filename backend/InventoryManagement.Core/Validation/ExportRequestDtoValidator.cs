using FluentValidation;
using InventoryManagement.Core.Constants;
using InventoryManagement.Core.DTOs;

namespace InventoryManagement.Core.Validation;

public class ExportRequestDtoValidator : AbstractValidator<ExportRequestDto>
{
    public ExportRequestDtoValidator()
    {
        RuleFor(x => x.Template)
            .NotEmpty().WithMessage(ValidationMessages.InvalidTemplate)
            .Must(t => t == PdfTemplates.Template1 || t == PdfTemplates.Template2)
            .WithMessage(ValidationMessages.InvalidTemplate);
    }
}
