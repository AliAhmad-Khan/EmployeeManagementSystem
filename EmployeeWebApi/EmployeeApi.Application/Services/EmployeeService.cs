using AutoMapper;
using EmployeeApi.Application.Common.Exceptions;
using EmployeeApi.Application.DTOs;
using EmployeeApi.Application.Interfaces;
using EmployeeApi.Domain.Common.Models;
using EmployeeApi.Domain.Entities;
using EmployeeApi.Domain.Interfaces;

namespace EmployeeApi.Application.Services
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _repo;
        private readonly IMapper _mapper;

        public EmployeeService(IEmployeeRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        public async Task<PagedResponse<EmployeeDto>> GetPagedAsync(int pageNumber, int pageSize, string? searchTerm)
        {
            var paged = await _repo.GetPagedAsync(pageNumber, pageSize, searchTerm);

            var dtoItems = _mapper.Map<IReadOnlyList<EmployeeDto>>(paged.Items);

            return new PagedResponse<EmployeeDto>(
                dtoItems,
                paged.TotalCount,
                paged.PageNumber,
                paged.PageSize);
        }
        public async Task<Guid> CreateAsync(EmployeeDto dto)
        {
            var entity = _mapper.Map<Employee>(dto);
            entity.Id = Guid.NewGuid();
            await _repo.AddAsync(entity);
            return entity.Id;
        }

        public async Task DeleteAsync(Guid id)
        {
            var existing = await _repo.GetByIdAsync(id);
            if (existing is null)
                throw new NotFoundException(nameof(Employee), id);

            await _repo.DeleteAsync(id);
        }

        public async Task<IReadOnlyList<EmployeeDto>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return _mapper.Map<IReadOnlyList<EmployeeDto>>(list);
        }

        public async Task<EmployeeDto> GetByIdAsync(Guid id)
        {
            var entity = await _repo.GetByIdAsync(id);
            if (entity is null)
                throw new NotFoundException(nameof(Employee), id);

            return _mapper.Map<EmployeeDto>(entity);
        }

        public async Task UpdateAsync(EmployeeDto dto)
        {
            var existing = await _repo.GetByIdAsync(dto.Id);
            if (existing is null)
                throw new NotFoundException(nameof(Employee), dto.Id);

            var entity = _mapper.Map<Employee>(dto);
            await _repo.UpdateAsync(entity);
        }
    }
}
