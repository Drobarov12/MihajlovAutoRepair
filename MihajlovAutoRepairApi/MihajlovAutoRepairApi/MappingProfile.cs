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
            .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User != null ? src.User.Name : "Guest"))
            .ForMember(dest => dest.UserPhoneNumber, opt => opt.MapFrom(src => src.User != null ? src.User.PhoneNumber : "No number"))
            .ForMember(dest => dest.ModelName, opt => opt.MapFrom(src => src.Model.ModelName))
            .ForMember(dest => dest.TypeName, opt => opt.MapFrom(src => src.Type.TypeName));

        CreateMap<ReservationCreateDto, Reservation>();
        CreateMap<ReservationDto, Reservation>();


        CreateMap<User, UserDto>()
            .ForMember(dest => dest.ModelName, 
                opt => opt.MapFrom(src => src.Model != null && src.Model.Any() ? src.Model.First().ModelName : string.Empty));
        CreateMap<UserCreateDto, User>();

        CreateMap<Type, TypeDto>();
        CreateMap<TypeCreateDto, Type>();
        
        CreateMap<Model, ModelDto>();
        CreateMap<ModelCreateDto, Model>();
    }
}