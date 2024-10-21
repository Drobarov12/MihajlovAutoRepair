using AutoMapper;
using MihajlovAutoRepairApi.Models;
using MihajlovAutoRepairApi.Models.Dtos;
using Type = MihajlovAutoRepairApi.Models.Type;

namespace MihajlovAutoRepairApi;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Reservation, ReservationDto>()
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.Username))
            .ForMember(dest => dest.ModelName, opt => opt.MapFrom(src => src.Model.ModelName))
            .ForMember(dest => dest.TypeName, opt => opt.MapFrom(src => src.Type.TypeName));

        CreateMap<ReservationCreateDto, Reservation>();
        
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.ModelName, opt => opt.MapFrom(src => src.Model.ModelName));
        CreateMap<UserCreateDto, User>();

        CreateMap<Type, TypeDto>();
        CreateMap<TypeCreateDto, Type>();
        
        CreateMap<Model, ModelDto>();
        CreateMap<ModelCreateDto, Model>();
    }
}