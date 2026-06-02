using FluentValidation;
using InventoryManagement.Core.Constants;
using InventoryManagement.Core.DTOs;

namespace InventoryManagement.Core.Validation;

public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserDtoValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage(ValidationMessages.FirstNameRequired)
            .MaximumLength(100).WithMessage(ValidationMessages.FirstNameMaxLength);

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage(ValidationMessages.LastNameRequired)
            .MaximumLength(100).WithMessage(ValidationMessages.LastNameMaxLength);
    }
}
