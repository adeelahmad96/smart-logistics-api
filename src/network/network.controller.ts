import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NetworkService } from './network.service';
import { UploadNetworkDto } from './dto/upload-network.dto';

@ApiTags('Network')
@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a new graph network' })
  @ApiResponse({ status: 201, description: 'Network created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request body' })
  upload(@Body() dto: UploadNetworkDto) {
    return this.networkService.upload(dto);
  }

  @Get('nodes/:id')
  @ApiOperation({ summary: 'Get all nodes for a network' })
  @ApiParam({ name: 'id', description: 'Network ID' })
  @ApiResponse({ status: 200, description: 'List of nodes' })
  @ApiResponse({ status: 404, description: 'Network not found' })
  getNodes(@Param('id') id: string) {
    const network = this.networkService.findById(id);
    if (!network) throw new NotFoundException(`No network found with id: ${id}`);
    return { graphId: network.id, nodes: network.nodes };
  }
}
