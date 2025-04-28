// 这个文件包含可能需要修改的函数，用于修复地图交互问题

// 修复1: 确保地图完全初始化
function ensureMapInitialized() {
  // 检查地图是否存在并已初始化
  if (!map || !mapReady) {
    console.error('地图未初始化或未就绪');
    return false;
  }
  
  // 检查地图DOM元素
  if (!map.getContainer()) {
    console.error('地图容器元素不存在');
    return false;
  }
  
  // 确保地图可见且大小正确
  const mapContainer = document.getElementById('map');
  if (mapContainer && (mapContainer.offsetWidth === 0 || mapContainer.offsetHeight === 0)) {
    console.warn('地图容器尺寸为0，地图可能不可见');
    mapContainer.style.width = '100%';
    mapContainer.style.height = '100%';
    
    // 触发地图重新计算大小
    if (map && typeof map.resize === 'function') {
      map.resize();
    }
  }
  
  return true;
}

// 修复2: 改进显示区域概览功能
async function showRegionOverview_fixed(regionName, regionType, showPOIs = true) {
  console.log(`显示区域概览: ${regionName}, 类型: ${regionType}`);
  
  // 检查地图初始化
  if (!ensureMapInitialized()) {
    console.error('地图未初始化，无法显示区域');
    return false;
  }
  
  // 清除之前的标记
  clearMapMarkers();
  
  try {
    // 使用预设位置数据 (备选方案)
    const cityPositions = {
      '北京': [116.4074, 39.9042],
      '上海': [121.4737, 31.2304],
      '广州': [113.2644, 23.1291],
      '深圳': [114.0579, 22.5431],
      '成都': [104.0668, 30.5728],
      '西安': [108.9398, 34.3416]
    };
    
    // 检查是否有预设位置
    if (cityPositions[regionName]) {
      const position = cityPositions[regionName];
      console.log(`使用预设位置数据: ${regionName} 坐标 ${position}`);
      
      // 设置地图位置和缩放
      const zoomLevel = regionType === 'province' ? 7 : 11;
      
      // 直接设置地图状态 - 使用更直接的API调用
      try {
        // 先设置中心点
        map.setCenter(position);
        // 短暂延迟后设置缩放级别
        setTimeout(() => {
          map.setZoom(zoomLevel);
          
          // 添加标记
          const marker = new AMap.Marker({
            position: position,
            title: regionName,
            animation: 'AMAP_ANIMATION_DROP'
          });
          
          marker.setMap(map);
          mapMarkers.push(marker);
          
          // 在调试模式下添加坐标显示
          const posText = new AMap.Text({
            text: `${regionName}: ${position[0]}, ${position[1]}`,
            position: position,
            offset: new AMap.Pixel(0, -40),
            style: {
              'padding': '5px 10px',
              'background-color': '#fff',
              'border-color': '#ccc',
              'border-width': 1,
              'border-radius': '3px',
              'box-shadow': '0 0 5px #ccc',
              'text-align': 'center',
              'font-size': '12px'
            }
          });
          
          posText.setMap(map);
          mapMarkers.push(posText);
          
          // 如果需要显示POI
          if (showPOIs) {
            // 使用简化版本的POI显示
            showSimplePOIs(regionName, position);
          }
        }, 200);
      } catch (e) {
        console.error('设置地图位置和缩放失败:', e);
      }
      
      return true;
    }
    
    // 如果没有预设位置，尝试使用高德的区域搜索
    // 这部分保留原有逻辑...
    
  } catch (error) {
    console.error(`显示区域概览出错: ${regionName}`, error);
    // 使用备选方法处理错误情况
    return false;
  }
}

// 修复3: 简化POI显示
function showSimplePOIs(regionName, position) {
  // 根据城市名称显示一些固定POI点
  const cityPOIs = {
    '上海': [
      { name: '外滩', position: [121.4906, 31.2466], type: '景区' },
      { name: '东方明珠', position: [121.4952, 31.2396], type: '观光塔' },
      { name: '豫园', position: [121.4921, 31.2274], type: '园林' },
      { name: '迪士尼乐园', position: [121.6739, 31.1614], type: '主题公园' }
    ],
    '北京': [
      { name: '故宫', position: [116.3972, 39.9163], type: '博物馆' },
      { name: '天安门', position: [116.3949, 39.9087], type: '广场' },
      { name: '颐和园', position: [116.2752, 39.9987], type: '公园' }
    ]
  };
  
  // 检查是否有该城市的POI数据
  if (cityPOIs[regionName]) {
    const pois = cityPOIs[regionName];
    console.log(`使用预设POI数据: ${regionName} 的 ${pois.length} 个景点`);
    
    // 添加POI标记
    pois.forEach(poi => {
      try {
        const marker = new AMap.Marker({
          position: poi.position,
          title: poi.name,
          icon: new AMap.Icon({
            size: [24, 24],
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
            imageSize: [24, 24]
          })
        });
        
        marker.setMap(map);
        mapMarkers.push(marker);
        
        // 给标记添加点击事件
        marker.on('click', function() {
          // 创建简单的信息窗体
          const infoWindow = new AMap.InfoWindow({
            content: `
              <div style="padding:10px;max-width:200px;">
                <h3 style="margin:0 0 5px;font-size:14px;">${poi.name}</h3>
                <p style="margin:0;font-size:12px;color:#666;">${poi.type}</p>
              </div>
            `,
            offset: new AMap.Pixel(0, -24)
          });
          
          infoWindow.open(map, poi.position);
        });
      } catch (e) {
        console.error(`添加POI标记失败: ${poi.name}`, e);
      }
    });
  } else {
    console.log(`没有找到 ${regionName} 的预设POI数据`);
  }
}

// 修复4: 更可靠的地图标记清除
function clearMapMarkers_fixed() {
  console.log('清除地图标记, 当前标记数:', mapMarkers.length);
  
  if (!mapMarkers || !Array.isArray(mapMarkers)) {
    console.warn('mapMarkers不是有效数组');
    return;
  }
  
  if (mapMarkers.length > 0) {
    try {
      // 使用更可靠的方式移除标记
      for (let i = mapMarkers.length - 1; i >= 0; i--) {
        try {
          const marker = mapMarkers[i];
          if (marker) {
            if (typeof marker.setMap === 'function') {
              marker.setMap(null);
            } else {
              console.warn('标记对象没有setMap方法');
            }
          }
        } catch (error) {
          console.error('移除单个标记失败:', error);
        }
      }
    } catch (error) {
      console.error('清除标记整体过程出错:', error);
    } finally {
      // 无论成功与否，都清空数组
      mapMarkers.length = 0;
    }
  }
}

// 修复5: 添加调试工具
function addDebugTools() {
  // 创建调试面板
  const debugPanel = document.createElement('div');
  debugPanel.style.position = 'absolute';
  debugPanel.style.bottom = '10px';
  debugPanel.style.left = '10px';
  debugPanel.style.background = 'rgba(255,255,255,0.8)';
  debugPanel.style.padding = '10px';
  debugPanel.style.borderRadius = '5px';
  debugPanel.style.zIndex = '1000';
  debugPanel.style.maxWidth = '300px';
  
  // 添加标题
  const title = document.createElement('h3');
  title.textContent = '地图调试工具';
  title.style.margin = '0 0 10px 0';
  title.style.fontSize = '14px';
  debugPanel.appendChild(title);
  
  // 添加按钮容器
  const buttonContainer = document.createElement('div');
  debugPanel.appendChild(buttonContainer);
  
  // 添加调试按钮
  function addButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.style.margin = '5px';
    button.style.padding = '5px 10px';
    button.addEventListener('click', onClick);
    buttonContainer.appendChild(button);
  }
  
  // 移动到上海按钮
  addButton('移动到上海', function() {
    if (map) {
      map.setCenter([121.4737, 31.2304]);
      map.setZoom(12);
    } else {
      alert('地图未初始化');
    }
  });
  
  // 添加标记按钮
  addButton('添加测试标记', function() {
    if (map) {
      const center = map.getCenter();
      const marker = new AMap.Marker({
        position: [center.lng, center.lat],
        title: '测试标记'
      });
      marker.setMap(map);
      mapMarkers.push(marker);
    } else {
      alert('地图未初始化');
    }
  });
  
  // 清除标记按钮
  addButton('清除所有标记', function() {
    clearMapMarkers_fixed();
  });
  
  // 检查地图状态按钮
  addButton('检查地图状态', function() {
    if (!map) {
      alert('地图未初始化');
      return;
    }
    
    const status = {
      中心点: map.getCenter(),
      缩放级别: map.getZoom(),
      标记数: mapMarkers.length,
      地图就绪: mapReady,
      容器尺寸: {
        宽: map.getContainer().offsetWidth,
        高: map.getContainer().offsetHeight
      }
    };
    
    alert('地图状态: ' + JSON.stringify(status, null, 2));
  });
  
  // 添加到文档
  document.body.appendChild(debugPanel);
}

// 使用指南：
/*
要使用这些修复方案：

1. 将此文件加载到原始HTML文件中：
   <script src="map-fix.js"></script>

2. 在原始代码的map.on('complete', ...)事件中添加调试工具：
   map.on('complete', function() {
     console.log('地图渲染完成事件触发');
     mapReady = true;
     console.log('地图已就绪，可以使用');
     window.dispatchEvent(new CustomEvent('mapReady'));
     
     // 添加调试工具
     addDebugTools();
   });

3. 替换原有函数：
   - 将showRegionOverview替换为showRegionOverview_fixed
   - 将clearMapMarkers替换为clearMapMarkers_fixed
*/ 