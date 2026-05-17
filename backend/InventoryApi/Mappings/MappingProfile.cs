using AutoMapper;
using InventoryApi.Models;
using InventoryApi.DTOs;

namespace InventoryApi.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>();
        CreateMap<CreateUserDto, User>();

        CreateMap<InventoryItem, InventoryItemDto>()
    .ConstructUsing(src => new InventoryItemDto(
        src.Id,
        src.Type.ToString(),
        src.Comment,
        src.PurchaseDate,
        src.IsDeleted,
        src.UserId,
        src.User != null ? $"{src.User.FirstName} {src.User.LastName}" : null
    ));

        CreateMap<CreateInventoryItemDto, InventoryItem>()
            .ForMember(dest => dest.Type, opt =>
                opt.MapFrom(src => Enum.Parse<ItemType>(src.Type, true)));

        CreateMap<UpdateInventoryItemDto, InventoryItem>()
            .ForMember(dest => dest.Type, opt =>
                opt.MapFrom(src => Enum.Parse<ItemType>(src.Type, true)));
    }
}
