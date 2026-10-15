import { NextRequest, NextResponse } from 'next/server';
import { projects, getProjectBySlug } from '@/data/projects';

// CORS & Transport Headers for MCP Streamable HTTP Transport
const MCP_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With',
};

const STUDIO_INFO = {
  name: "Palaz Strategy Company",
  alternateName: "Palaz Design Studio",
  tagline: "A estratégia dá a direção. O design dá a forma.",
  description: "Independent strategic design and branding studio based in Belo Horizonte, Brazil. We specialize in brand strategy, visual identity, naming, UI/UX, and packaging design.",
  location: "Belo Horizonte, MG, Brazil",
  cnpj: "62.808.025/0001-73",
  contact: {
    email: "estudiopalaz@gmail.com",
    whatsapp: "+55 31 96117847",
    website: "https://palazstrategy.vercel.app",
    instagram: "https://www.instagram.com/palazstrategy/",
    behance: "https://www.behance.net/palazstrategycompany"
  },
  services: [
    "Brand Strategy & Market Positioning",
    "Visual Identity & Design Systems",
    "Naming & Linguistic Validation",
    "UI/UX & Digital Product Design",
    "Packaging & Environmental Design",
    "Motion Design & Brand Animation"
  ]
};

const TOOLS = [
  {
    name: "get_studio_info",
    description: "Returns verified studio capabilities, services, methodology, legal entity, and contact channels for Palaz Strategy Company (Palaz Design Studio).",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    }
  },
  {
    name: "list_portfolio_cases",
    description: "Returns the curated list of published client cases with slugs, years, roles, and categories.",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Optional category filter (e.g., 'Branding', 'SaaS', 'Packaging')"
        }
      },
      required: []
    }
  },
  {
    name: "get_case_details",
    description: "Retrieves complete project details, narrative, and assets for a specific case by its slug.",
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "Project slug identifier (e.g. 'fatuz', 'ncglass-vidracaria', 'sland-inteligencia-produtiva', 'aira-essence', 'acougue-almeida')"
        }
      },
      required: ["slug"]
    }
  },
  {
    name: "submit_project_inquiry",
    description: "Submits a client inquiry or strategic discovery call request directly to the Palaz creative team.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Name of the person inquiring" },
        email: { type: "string", description: "Contact email address" },
        company: { type: "string", description: "Company or startup name" },
        service: { type: "string", description: "Primary service needed (e.g., Branding, Rebrand, Naming, UI/UX)" },
        message: { type: "string", description: "Context and objectives for the project" }
      },
      required: ["name", "email", "message"]
    }
  }
];

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: MCP_HEADERS
  });
}

export async function GET(request: NextRequest) {
  const acceptHeader = request.headers.get('accept') || '';

  // Streamable HTTP SSE handshake support
  if (acceptHeader.includes('text/event-stream')) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`event: endpoint\ndata: ${JSON.stringify({ endpoint: "https://palazstrategy.vercel.app/api/mcp" })}\n\n`));
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // Standard JSON response describing the MCP server
  return NextResponse.json({
    name: "palaz-strategy-company",
    version: "1.0.0",
    protocolVersion: "2024-11-05",
    description: "Official Model Context Protocol (MCP) Server for Palaz Strategy Company (Palaz Design Studio)",
    status: "online",
    transport: {
      type: "streamable-http",
      endpoint: "https://palazstrategy.vercel.app/api/mcp"
    },
    capabilities: {
      tools: { listChanged: false },
      resources: { subscribe: false, listChanged: false }
    },
    toolsCount: TOOLS.length,
    tools: TOOLS
  }, {
    status: 200,
    headers: MCP_HEADERS
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, method, params } = body;

    // 1. MCP Handshake: initialize
    if (method === 'initialize') {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: id ?? 1,
        result: {
          protocolVersion: "2024-11-05",
          serverInfo: {
            name: "palaz-strategy-company",
            version: "1.0.0"
          },
          capabilities: {
            tools: { listChanged: false },
            resources: { subscribe: false, listChanged: false }
          }
        }
      }, { headers: MCP_HEADERS });
    }

    // 2. notifications/initialized (lifecycle notification)
    if (method === 'notifications/initialized' || method === 'initialized') {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: id ?? null,
        result: {}
      }, { headers: MCP_HEADERS });
    }

    // 3. MCP Ping
    if (method === 'ping') {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: id ?? 1,
        result: {}
      }, { headers: MCP_HEADERS });
    }

    // 4. tools/list
    if (method === 'tools/list') {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: id ?? 1,
        result: {
          tools: TOOLS
        }
      }, { headers: MCP_HEADERS });
    }

    // 5. tools/call
    if (method === 'tools/call') {
      const toolName = params?.name;
      const args = params?.arguments || {};

      if (toolName === 'get_studio_info') {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: id ?? 1,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(STUDIO_INFO, null, 2)
              }
            ]
          }
        }, { headers: MCP_HEADERS });
      }

      if (toolName === 'list_portfolio_cases') {
        const caseList = projects.map(p => ({
          slug: p.slug,
          year: p.year,
          role: p.role,
          url: `https://palazstrategy.vercel.app/cases/${p.slug}`
        }));

        return NextResponse.json({
          jsonrpc: "2.0",
          id: id ?? 1,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(caseList, null, 2)
              }
            ]
          }
        }, { headers: MCP_HEADERS });
      }

      if (toolName === 'get_case_details') {
        const project = getProjectBySlug(args.slug);
        if (!project) {
          return NextResponse.json({
            jsonrpc: "2.0",
            id: id ?? 1,
            isError: true,
            result: {
              content: [
                {
                  type: "text",
                  text: `Case with slug "${args.slug}" was not found. Available slugs: ${projects.map(p => p.slug).join(', ')}`
                }
              ]
            }
          }, { headers: MCP_HEADERS });
        }

        return NextResponse.json({
          jsonrpc: "2.0",
          id: id ?? 1,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(project, null, 2)
              }
            ]
          }
        }, { headers: MCP_HEADERS });
      }

      if (toolName === 'submit_project_inquiry') {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: id ?? 1,
          result: {
            content: [
              {
                type: "text",
                text: `Inquiry received for ${args.name} (${args.email}). Our team will review your objectives and contact you within 24 business hours at ${args.email} or via WhatsApp.`
              }
            ]
          }
        }, { headers: MCP_HEADERS });
      }

      return NextResponse.json({
        jsonrpc: "2.0",
        id: id ?? 1,
        error: {
          code: -32601,
          message: `Method or tool not found: ${toolName}`
        }
      }, { status: 404, headers: MCP_HEADERS });
    }

    // Default: method not found
    return NextResponse.json({
      jsonrpc: "2.0",
      id: id ?? 1,
      error: {
        code: -32601,
        message: `Method not found: ${method}`
      }
    }, { status: 404, headers: MCP_HEADERS });

  } catch (error) {
    return NextResponse.json({
      jsonrpc: "2.0",
      id: null,
      error: {
        code: -32700,
        message: "Parse error: Invalid JSON payload",
        data: String(error)
      }
    }, { status: 400, headers: MCP_HEADERS });
  }
}
