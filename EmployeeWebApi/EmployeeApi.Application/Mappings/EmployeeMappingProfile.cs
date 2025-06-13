using AutoMapper;
using EmployeeApi.Domain.Entities;
using EmployeeApi.Application.DTOs;

namespace EmployeeApi.Application.Mappings
{
    public class EmployeeMappingProfile : Profile
    {
        public EmployeeMappingProfile()
        {
            CreateMap<Employee, EmployeeDto>().ReverseMap();
        }
    }
}
