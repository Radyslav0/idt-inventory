using FluentValidation;
using InventoryManagement.Core.Constants;
using InventoryManagement.Core.DTOs;

namespace InventoryManagement.Core.Validation;

public class UpdateInventoryItemDtoValidator : AbstractValidator<UpdateInventoryItemDto>
{
    public UpdateInventoryItemDtoValidator()
    {
        RuleFor(x => x.Type)
            .NotEmpty().WithMessage(ValidationMessages.InvalidItemType)
            .Must(t => ItemTypeNames.All.Contains(t))
            .WithMessage(ValidationMessages.InvalidItemType);

        RuleFor(x => x.Comment)
            .NotEmpty().WithMessage(ValidationMessages.CommentRequired)
            .MaximumLength(500).WithMessage(ValidationMessages.CommentMaxLength);

        RuleFor(x => x.PurchaseDate)
            .NotEmpty().WithMessage(ValidationMessages.PurchaseDateRequired);
    }
}
