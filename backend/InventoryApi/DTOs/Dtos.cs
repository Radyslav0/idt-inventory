namespace InventoryApi.DTOs;

// User DTOs
public record UserDto(Guid Id, string FirstName, string LastName);

public record CreateUserDto(string FirstName, string LastName);

// Inventory DTOs
public record InventoryItemDto(
    Guid Id,
    string Type,
    string Comment,
    DateTime PurchaseDate,
    bool IsDeleted,
    Guid? UserId,
    string? UserFullName
);

public record CreateInventoryItemDto(
    string Type,
    string Comment,
    DateTime PurchaseDate,
    Guid? UserId
);

public record UpdateInventoryItemDto(
    string Type,
    string Comment,
    DateTime PurchaseDate,
    Guid? UserId
);

// Filter DTO
public record InventoryFilterDto(
    string? Type,
    string? Comment,
    Guid? UserId,
    bool IncludeDeleted = false
);

// Export DTO
public record ExportRequestDto(
    string Template,          // "template1" | "template2"
    string? Type,
    string? Comment,
    Guid? UserId
);
