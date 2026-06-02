namespace InventoryManagement.Core.Constants;

public static class ItemTypeNames
{
    public const string Tablet  = "Tablet";
    public const string Phone   = "Phone";
    public const string SimCard = "SimCard";
    public const string Laptop  = "Laptop";

    public static readonly IReadOnlyList<string> All =
        [Tablet, Phone, SimCard, Laptop];
}

public static class PdfTemplates
{
    public const string Template1 = "template1";
    public const string Template2 = "template2";
}

public static class ValidationMessages
{
    public const string FirstNameRequired    = "First name is required.";
    public const string LastNameRequired     = "Last name is required.";
    public const string FirstNameMaxLength   = "First name must not exceed 100 characters.";
    public const string LastNameMaxLength    = "Last name must not exceed 100 characters.";
    public const string CommentRequired      = "Comment is required.";
    public const string CommentMaxLength     = "Comment must not exceed 500 characters.";
    public const string InvalidItemType      = "Item type is invalid.";
    public const string PurchaseDateRequired = "Purchase date is required.";
    public const string InvalidTemplate      = "Template must be 'template1' or 'template2'.";
}
