export const REQUIRED_SPECS = {
  cpu:         ['socket', 'tdp', 'cores', 'ramType', 'tier'],
  motherboard: ['socket', 'chipset', 'ramType', 'formFactor'],
  ram:         ['type', 'capacityGb', 'speedMhz'],
  gpu:         ['tdp', 'vramGb', 'lengthMm', 'tier'],
  psu:         ['wattage', 'certification'],
  storage:     ['type', 'capacityGb'],
  coolers:     ['type', 'socketCompat'],
  gabinetes:   ['formFactor', 'maxGpuLengthMm', 'maxCoolerHeightMm'],
}

export const requiredFor = (categoryId) => REQUIRED_SPECS[categoryId] || []
