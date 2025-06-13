using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using FluentAssertions;
using Moq;
using EmployeeApi.Application.DTOs;
using EmployeeApi.Application.Mappings;
using EmployeeApi.Application.Services;
using EmployeeApi.Domain.Entities;
using EmployeeApi.Domain.Interfaces;
using Xunit;

namespace EmployeeApi.Application.Tests.Services
{
    public class EmployeeServiceTests
    {
        private readonly IMapper _mapper;

        public EmployeeServiceTests()
        {
            // Initialize the real AutoMapper config
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new EmployeeMappingProfile());
            });
            _mapper = config.CreateMapper();
        }

        [Fact]
        public async Task GetAllAsync_ReturnsMappedDtos()
        {
            // Arrange
            var employees = new List<Employee>
            {
                new() { Id = Guid.NewGuid(), FirstName = "A", LastName = "B", Email="a@b.com", DateOfBirth = DateTime.Today, Department="X" }
            };
            var repoMock = new Mock<IEmployeeRepository>();
            repoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(employees);

            var service = new EmployeeService(repoMock.Object, _mapper);

            // Act
            var dtos = await service.GetAllAsync();

            // Assert
            dtos.Should().HaveCount(1);
            dtos[0].FirstName.Should().Be("A");
            repoMock.Verify(r => r.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task CreateAsync_AssignsNewGuidAndCallsAdd()
        {
            // Arrange
            var dto = new EmployeeDto { FirstName = "X", LastName = "Y", Email = "x@y.com", DateOfBirth = DateTime.Today, Department = "D" };
            var repoMock = new Mock<IEmployeeRepository>();
            var service = new EmployeeService(repoMock.Object, _mapper);

            // Act
            var newId = await service.CreateAsync(dto);

            // Assert
            newId.Should().NotBe(Guid.Empty);
            repoMock.Verify(r => r.AddAsync(It.Is<Employee>(e => e.Id == newId && e.FirstName == "X")), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_CallsRepositoryUpdate()
        {
            // Arrange
            var dto = new EmployeeDto { Id = Guid.NewGuid(), FirstName = "U", LastName = "P", Email = "u@p.com", DateOfBirth = DateTime.Today, Department = "Dev" };
            var repoMock = new Mock<IEmployeeRepository>();
            var service = new EmployeeService(repoMock.Object, _mapper);

            // Act
            await service.UpdateAsync(dto);

            // Assert
            repoMock.Verify(r => r.UpdateAsync(It.Is<Employee>(e => e.Id == dto.Id && e.Department == "Dev")), Times.Once);
        }

        [Fact]
        public async Task DeleteAsync_CallsRepositoryDelete()
        {
            // Arrange
            var id = Guid.NewGuid();
            var repoMock = new Mock<IEmployeeRepository>();
            var service = new EmployeeService(repoMock.Object, _mapper);

            // Act
            await service.DeleteAsync(id);

            // Assert
            repoMock.Verify(r => r.DeleteAsync(id), Times.Once);
        }

        [Fact]
        public async Task GetByIdAsync_WhenNotFound_ReturnsNull()
        {
            // Arrange
            var id = Guid.NewGuid();
            var repoMock = new Mock<IEmployeeRepository>();
            repoMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((Employee?)null);
            var service = new EmployeeService(repoMock.Object, _mapper);

            // Act
            var dto = await service.GetByIdAsync(id);

            // Assert
            dto.Should().BeNull();
        }
    }
}
