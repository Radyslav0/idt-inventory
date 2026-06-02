using AutoMapper;
using InventoryManagement.Core.DTOs;
using InventoryManagement.Core.Interfaces.Repositories;
using InventoryManagement.Core.Interfaces.Services;
using InventoryManagement.Core.Models;

namespace InventoryManagement.API.Services;

public class UserService(IUserRepository userRepository, IMapper mapper) : IUserService
{
    public async Task<IEnumerable<UserDto>> GetAllAsync()
    {
        var users = await userRepository.GetAllAsync();
        return mapper.Map<IEnumerable<UserDto>>(users);
    }

    public async Task<UserDto?> GetByIdAsync(Guid id)
    {
        var user = await userRepository.GetByIdAsync(id);
        return user is null ? null : mapper.Map<UserDto>(user);
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto)
    {
        var user = mapper.Map<User>(dto);
        await userRepository.AddAsync(user);
        await userRepository.SaveChangesAsync();
        return mapper.Map<UserDto>(user);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var user = await userRepository.GetByIdAsync(id);
        if (user is null) return false;
        await userRepository.DeleteAsync(user);
        await userRepository.SaveChangesAsync();
        return true;
    }
}
