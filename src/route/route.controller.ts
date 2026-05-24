import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RouteService } from './route.service';
import { OptimizeRouteDto } from './dto/optimize-route.dto';

@ApiTags('Route')
@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Post('optimize/:id')
  @ApiOperation({ summary: 'Find the optimal route between two nodes' })
  @ApiParam({ name: 'id', description: 'Network ID' })
  @ApiResponse({ status: 200, description: 'Optimal route calculated' })
  @ApiResponse({ status: 400, description: 'Invalid nodes or no route exists' })
  @ApiResponse({ status: 404, description: 'Network not found' })
  optimize(@Param('id') id: string, @Body() dto: OptimizeRouteDto) {
    return this.routeService.optimize(id, dto);
  }
}
