import { NextResponse } from 'next/server'

const products = [
  {
    id: 1,
    title: "Cam Sành Việt Nam",
    price: 1.5,
    category: { id: 1, name: "Trái cây nhiệt đới" },
    images: [
      "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=500",
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=500",
      "https://images.unsplash.com/photo-1547514701-42782101795e?w=500"
    ],
    description: "Cam sành ngọt, nhiều nước, giàu vitamin C. Nguồn gốc từ Việt Nam. Thích hợp ăn tươi hoặc vắt nước.",
    origin: "Việt Nam",
    unit: "kg",
    nutrition: {
      calories: 47,
      vitamin_c: 53.2,
      fiber: 2.4,
      sugar: 9.4
    }
  },
  {
    id: 2,
    title: "Táo Fuji Nhật Bản",
    price: 2.8,
    category: { id: 2, name: "Trái cây ôn đới" },
    images: [
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500",
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500",
      "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500"
    ],
    description: "Táo Fuji giòn ngọt, chất lượng cao từ Nhật Bản. Giàu chất xơ, giúp tiêu hóa tốt.",
    origin: "Nhật Bản",
    unit: "kg",
    nutrition: {
      calories: 52,
      vitamin_c: 4.6,
      fiber: 2.4,
      sugar: 10.4
    }
  },
  {
    id: 3,
    title: "Chuối Tiêu Hữu Cơ",
    price: 1.0,
    category: { id: 1, name: "Trái cây nhiệt đới" },
    images: [
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500",
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500",
      "https://images.unsplash.com/photo-1528825871115-3581a5387919?w=500"
    ],
    description: "Chuối tiêu thơm ngon, giàu kali. Tốt cho sức khỏe tim mạch và cung cấp năng lượng nhanh.",
    origin: "Việt Nam",
    unit: "kg",
    nutrition: {
      calories: 89,
      potassium: 358,
      vitamin_b6: 0.4,
      sugar: 12.2
    }
  },
  {
    id: 4,
    title: "Dưa Hấu Không Hạt",
    price: 0.8,
    category: { id: 1, name: "Trái cây nhiệt đới" },
    images: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784720?w=500",
      "https://images.unsplash.com/photo-1621583832599-8b8f83b89dcd?w=500",
      "https://images.unsplash.com/photo-1629825012756-c8f4286eb1fd?w=500"
    ],
    description: "Dưa hấu ngọt mát, nhiều nước. Giải nhiệt mùa hè hiệu quả, chứa lycopene tốt cho da.",
    origin: "Việt Nam",
    unit: "kg",
    nutrition: {
      calories: 30,
      vitamin_c: 8.1,
      water: 91.5
    }
  },
  {
    id: 5,
    title: "Xoài Cát Hòa Lộc",
    price: 3.5,
    category: { id: 1, name: "Trái cây nhiệt đới" },
    images: [
      "https://images.unsplash.com/photo-1605664515896-a69d480be46c?w=500",
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=500",
      "https://images.unsplash.com/photo-1553279768-865429e2f8e6?w=500"
    ],
    description: "Xoài cát Hòa Lộc thơm ngon đặc biệt. Đặc sản Tiền Giang, vị ngọt đậm, thịt mềm mịn.",
    origin: "Tiền Giang, Việt Nam",
    unit: "kg",
    nutrition: {
      calories: 60,
      vitamin_c: 36.4,
      vitamin_a: 54,
      fiber: 1.6
    }
  },
  {
    id: 6,
    title: "Nho Mỹ Không Hạt",
    price: 5.0,
    category: { id: 2, name: "Trái cây ôn đới" },
    images: [
      "https://images.unsplash.com/photo-1599819177303-7d14f7e44479?w=500",
      "https://images.unsplash.com/photo-1596363505729-4190a9506133?w=500",
      "https://images.unsplash.com/photo-1423483641154-5411ec9c0ddf?w=500"
    ],
    description: "Nho Mỹ không hạt, ngọt tự nhiên. Chất lượng cao, giàu resveratrol chống lão hóa.",
    origin: "Mỹ",
    unit: "kg",
    nutrition: {
      calories: 69,
      vitamin_c: 3.2,
      fiber: 0.9,
      sugar: 15.5
    }
  },
  {
    id: 7,
    title: "Dâu Tây Đà Lạt",
    price: 6.2,
    category: { id: 3, name: "Trái cây cao cấp" },
    images: [
      "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500",
      "https://images.unsplash.com/photo-1543158181-e6f9f6712055?w=500",
      "https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=500"
    ],
    description: "Dâu tây Đà Lạt tươi ngon, thơm mát. Giàu vitamin C, chống oxy hóa mạnh mẽ.",
    origin: "Đà Lạt, Việt Nam",
    unit: "kg",
    nutrition: {
      calories: 32,
      vitamin_c: 58.8,
      fiber: 2.0
    }
  },
  {
    id: 8,
    title: "Thanh Long Ruột Đỏ",
    price: 1.6,
    category: { id: 1, name: "Trái cây nhiệt đới" },
    images: [
      "https://images.unsplash.com/photo-1609103966249-ddf8b1f0e0f9?w=500",
      "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=500",
      "https://images.unsplash.com/photo-1615485500834-bc10199bc456?w=500"
    ],
    description: "Thanh long ruột đỏ ngọt mát. Đặc sản Bình Thuận, giàu chất xơ và vitamin.",
    origin: "Bình Thuận, Việt Nam",
    unit: "kg",
    nutrition: {
      calories: 60,
      vitamin_c: 9,
      fiber: 3.0
    }
  },
  {
    id: 9,
    title: "Bơ Booth 7",
    price: 4.5,
    category: { id: 1, name: "Trái cây nhiệt đới" },
    images: [
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500",
      "https://images.unsplash.com/photo-1519162808019-7de1683fa2aa?w=500",
      "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=500"
    ],
    description: "Bơ Booth 7 béo ngậy, giàu chất béo lành mạnh. Đặc sản Đắk Lắk, thịt dày màu vàng.",
    origin: "Đắk Lắk, Việt Nam",
    unit: "kg",
    nutrition: {
      calories: 160,
      fiber: 6.7,
      potassium: 485
    }
  },
  {
    id: 10,
    title: "Sầu Riêng Ri6",
    price: 8.0,
    category: { id: 3, name: "Trái cây cao cấp" },
    images: [
      "https://images.unsplash.com/photo-1585395376356-b43d6c2e4ea0?w=500",
      "https://images.unsplash.com/photo-1623688554676-918c360e8e81?w=500",
      "https://images.unsplash.com/photo-1584493315530-0c2ed8ac6f7f?w=500"
    ],
    description: "Sầu riêng Ri6 thơm ngậy, vị ngọt đậm đà. Múi dày, màu vàng cam, thơm nức.",
    origin: "Tiền Giang, Việt Nam",
    unit: "kg",
    nutrition: {
      calories: 147,
      vitamin_c: 19.7,
      potassium: 436
    }
  },
  {
    id: 11,
    title: "Lê Hàn Quốc",
    price: 3.8,
    category: { id: 2, name: "Trái cây ôn đới" },
    images: [
      "https://images.unsplash.com/photo-1569870499705-504209102861?w=500",
      "https://images.unsplash.com/photo-1609331253111-17517d5dc8d3?w=500",
      "https://images.unsplash.com/photo-1597994801032-16b2c15e6665?w=500"
    ],
    description: "Lê Hàn Quốc giòn ngọt, nhiều nước. Size lớn, vỏ mỏng, thịt trắng tinh.",
    origin: "Hàn Quốc",
    unit: "kg",
    nutrition: {
      calories: 57,
      vitamin_c: 4.3,
      fiber: 3.1
    }
  },
  {
    id: 12,
    title: "Cherry Úc",
    price: 15.0,
    category: { id: 3, name: "Trái cây cao cấp" },
    images: [
      "https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=500",
      "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=500",
      "https://images.unsplash.com/photo-1619564043991-4b0e4a9c87b3?w=500"
    ],
    description: "Cherry Úc nhập khẩu tươi ngon. Màu đỏ tươi, vị ngọt thanh, size đại.",
    origin: "Úc",
    unit: "kg",
    nutrition: {
      calories: 63,
      vitamin_c: 7,
      fiber: 2.1
    }
  },
  {
    id: 13,
    title: "Ổi Nữ Hoàng",
    price: 1.2,
    category: { id: 1, name: "Trái cây nhiệt đới" },
    images: [
      "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=500",
      "https://images.unsplash.com/photo-1595919422795-a652331d0b9e?w=500",
      "https://images.unsplash.com/photo-1611082010019-3e7e0e5d5b01?w=500"
    ],
    description: "Ổi nữ hoàng giòn ngọt, ít hạt. Giàu vitamin C gấp 4 lần cam.",
    origin: "Việt Nam",
    unit: "kg",
    nutrition: {
      calories: 68,
      vitamin_c: 228.3,
      fiber: 5.4
    }
  },
  {
    id: 14,
    title: "Măng Cụt",
    price: 5.5,
    category: { id: 1, name: "Trái cây nhiệt đới" },
    images: [
      "https://images.unsplash.com/photo-1597879485969-ae531e1e73f8?w=500",
      "https://images.unsplash.com/photo-1600271886742-7a12e57c42a6?w=500",
      "https://images.unsplash.com/photo-1591206369811-4eeb2f18443d?w=500"
    ],
    description: "Măng cụt nữ hoàng trái cây. Vị ngọt thanh, thơm mát, giàu chất chống oxy hóa.",
    origin: "Việt Nam",
    unit: "kg",
    nutrition: {
      calories: 73,
      vitamin_c: 2.9,
      fiber: 1.8
    }
  },
  {
    id: 15,
    title: "Chôm Chôm",
    price: 2.2,
    category: { id: 1, name: "Trái cây nhiệt đới" },
    images: [
      "https://images.unsplash.com/photo-1580910365203-91ea2908b4e3?w=500",
      "https://images.unsplash.com/photo-1608452964553-9b4d97b2752f?w=500",
      "https://images.unsplash.com/photo-1591293835944-4c0c6f0c2f66?w=500"
    ],
    description: "Chôm chôm ngọt mát, thơm nhẹ. Thịt dày, giòn, múi to.",
    origin: "Việt Nam",
    unit: "kg",
    nutrition: {
      calories: 68,
      vitamin_c: 4.9,
      fiber: 0.9
    }
  },
  {
    id: 16,
    title: "Bưởi Da Xanh",
    price: 2.5,
    category: { id: 1, name: "Trái cây nhiệt đới" },
    images: [
      "https://images.unsplash.com/photo-1596097635941-94e52d99f7b9?w=500",
      "https://images.unsplash.com/photo-1608890819487-e5e0e6e98e87?w=500",
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500"
    ],
    description: "Bưởi da xanh Bến Tre ngọt thanh. Múi to, ít hạt, nhiều nước.",
    origin: "Bến Tre, Việt Nam",
    unit: "kg",
    nutrition: {
      calories: 38,
      vitamin_c: 61,
      fiber: 1.0
    }
  },
  {
    id: 17,
    title: "Dứa Mật",
    price: 1.8,
    category: { id: 1, name: "Trái cây nhiệt đới" },
    images: [
      "https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=500",
      "https://images.unsplash.com/photo-1587234259671-b6e7e3baa3a5?w=500",
      "https://images.unsplash.com/photo-1576832147865-80625ef3bcad?w=500"
    ],
    description: "Dứa mật ngọt thơm, ít xơ. Chứa enzyme bromelain giúp tiêu hóa.",
    origin: "Việt Nam",
    unit: "kg",
    nutrition: {
      calories: 50,
      vitamin_c: 47.8,
      fiber: 1.4
    }
  },
  {
    id: 18,
    title: "Mận Hậu",
    price: 4.0,
    category: { id: 2, name: "Trái cây ôn đới" },
    images: [
      "https://images.unsplash.com/photo-1599819177108-6b5ff6e38d14?w=500",
      "https://images.unsplash.com/photo-1629828874514-944d0b0b921d?w=500",
      "https://images.unsplash.com/photo-1598256710198-99c22965d5c0?w=500"
    ],
    description: "Mận hậu ngọt đậm, thơm lừng. Đặc sản Mộc Châu, quả to căng mọng.",
    origin: "Mộc Châu, Việt Nam",
    unit: "kg",
    nutrition: {
      calories: 46,
      vitamin_c: 9.5,
      vitamin_a: 17,
      fiber: 1.4
    }
  },
  {
    id: 19,
    title: "Vải Thiều Lục Ngạn",
    price: 5.8,
    category: { id: 1, name: "Trái cây nhiệt đới" },
    images: [
      "https://images.unsplash.com/photo-1590822224165-ecc5ce62f384?w=500",
      "https://images.unsplash.com/photo-1617282662393-874418b8e7a8?w=500",
      "https://images.unsplash.com/photo-1596897693750-7c7661a48d8b?w=500"
    ],
    description: "Vải thiều Lục Ngạn ngọt lịm, thơm nức. Múi dày, hạt lép, chỉ có mùa hè.",
    origin: "Lục Ngạn, Bắc Giang",
    unit: "kg",
    nutrition: {
      calories: 66,
      vitamin_c: 71.5,
      fiber: 1.3
    }
  },
  {
    id: 20,
    title: "Nhãn Lồng Hưng Yên",
    price: 4.5,
    category: { id: 1, name: "Trái cây nhiệt đới" },
    images: [
      "https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=500",
      "https://images.unsplash.com/photo-1599819177303-7d14f7e44479?w=500",
      "https://images.unsplash.com/photo-1592320937521-84c88747a68e?w=500"
    ],
    description: "Nhãn lồng Hưng Yên thơm ngọt đặc trưng. Múi dày, hạt nhỏ, vị đậm đà.",
    origin: "Hưng Yên, Việt Nam",
    unit: "kg",
    nutrition: {
      calories: 60,
      vitamin_c: 84,
      fiber: 1.1
    }
  }
]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  
  // Kiểm tra nếu có ID trong path (dù không có thư mục [id])
  const pathname = request.nextUrl.pathname
  const idMatch = pathname.match(/\/api\/products\/(\d+)$/)
  
  if (idMatch) {
    // Trả về single product
    const id = parseInt(idMatch[1])
    const product = products.find(p => p.id === id)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(product)
  }
  
  // Trả về danh sách products
  const category = searchParams.get('category')
  const limit = parseInt(searchParams.get('limit') || '100')
  const offset = parseInt(searchParams.get('offset') || '0')

  let filteredProducts = products

  // Filter by category
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(
      p => p.category.name === category
    )
  }

  // Apply pagination
  const paginatedProducts = filteredProducts.slice(offset, offset + limit)

  return NextResponse.json(paginatedProducts)
}