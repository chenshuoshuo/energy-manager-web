import proj4 from 'proj4'

export function transformBJZ54(lng, lat) {
  // 与目标坐标系差值最小的转换
  proj4.defs('EPSG:21458', '+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs')
  proj4.defs(
    'EPSG:4326',
    '+proj=longlat +datum=WGS84 +no_defs'
  )
  const target = proj4('EPSG:4326', 'EPSG:21458', [lng, lat])
  return target
}

export function transformWGS84(lng, lat) {
  // 与目标坐标系差值最小的转换
  proj4.defs('EPSG:21458', '+proj=tmerc +lat_0=0 +lon_0=105 +k=1 +x_0=500000 +y_0=0 +ellps=krass +towgs84=15.8,-154.4,-82.3,0,0,0,0 +units=m +no_defs')
  proj4.defs(
    'EPSG:4326',
    '+proj=longlat +datum=WGS84 +no_defs'
  )
  const target = proj4('EPSG:21458', 'EPSG:4326', [lng, lat])
  return target
}
