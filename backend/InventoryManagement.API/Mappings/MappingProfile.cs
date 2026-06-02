using AutoMapper;
using InventoryManagement.Core.DTOs;
using InventoryManagement.Core.Models;

namespace InventoryManagement.API.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>();
        CreateMap<CreateUserDto, User>();

        CreateMap<InventoryItem, InventoryItemDto>()
            .ForMember(dest => dest.Type,
                opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.UserFullName,
                opt => opt.MapFrom(src =>
                    src.User != null ? $"{src.User.FirstName} {src.User.LastName}" : null));

        CreateMap<CreateInventoryItemDto, InventoryItem>()
            .ForMember(dest => dest.Type,
                opt => opt.MapFrom(src => Enum.Parse<ItemType>(src.Type, ignoreCase: true)));

        CreateMap<UpdateInventoryItemDto, InventoryItem>()
            .ForMember(dest => dest.Type,
                opt => opt.MapFrom(src => Enum.Parse<ItemType>(src.Type, ignoreCase: true)));
    }
}
