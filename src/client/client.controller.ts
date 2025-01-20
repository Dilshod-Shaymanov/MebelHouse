import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../common/guards/admin.guard';
import { ClientSelfGuard } from '../common/guards/client-self.guard';
import { PaginationDto } from '../product/dto/pagination.dto';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @UseGuards(AdminGuard)
  @Get()
  @ApiOperation({ summary: 'Get all clients' })
  @ApiQuery({
    name: 'filter',
    required: false,
    description: 'Filter by client email or phone number',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Order of sorting',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: 10,
  })
  @ApiResponse({ status: 200, description: 'List of all clients' })
  async findAll(@Query() query: PaginationDto) {
    const {
      filter,
      order = 'asc',
      page = 1,
      limit = 10,
    } = query;

    const pageNum = parseInt(page.toString(), 10);
    const limitNum = parseInt(limit.toString(), 10);
    return this.clientService.findAll({
      filter,
      order,
      page: pageNum,
      limit: limitNum,
    });
  }

  @UseGuards(ClientSelfGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a client by ID' })
  @ApiParam({ name: 'id', description: 'Client unique identifier' })
  @ApiResponse({
    status: 200,
    description: 'Client information retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(+id);
  }

  @UseGuards(ClientSelfGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a Client' })
  @ApiParam({ name: 'id', description: 'Client unique identifier' })
  @ApiResponse({ status: 200, description: 'Client updated successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(+id, updateClientDto);
  }

  @UseGuards(ClientSelfGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a client' })
  @ApiParam({ name: 'id', description: 'Client unique identifier' })
  @ApiResponse({ status: 200, description: 'Client deleted successfully' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }
}
