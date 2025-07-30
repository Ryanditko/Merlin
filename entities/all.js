// Mock entities para o Merlin
export class User {
  static async me() {
    return {
      id: "1",
      email: "usuario@exemplo.com",
      full_name: "Usuário Demo",
      avatar: null
    };
  }

  static async login() {
    console.log("Login realizado com sucesso!");
    return this.me();
  }
}

export class Template {
  static async list() {
    return [
      { id: 1, title: "Relatório Mensal", description: "Template para relatórios mensais", category: "reports" },
      { id: 2, title: "Email Marketing", description: "Template para campanhas de email", category: "marketing" },
      { id: 3, title: "Apresentação", description: "Template para apresentações", category: "presentations" }
    ];
  }
}

export class Team {
  static async list() {
    return [
      { id: 1, name: "Equipe de Marketing", description: "Equipe responsável pelo marketing", members_count: 5 },
      { id: 2, name: "Equipe de Desenvolvimento", description: "Equipe de desenvolvimento", members_count: 8 }
    ];
  }
}

export class TeamMember {
  static async create(data) {
    return { id: Date.now(), ...data };
  }

  static async list(teamId) {
    return [
      { id: 1, team_id: teamId, user_email: "admin@exemplo.com", role: "admin" },
      { id: 2, team_id: teamId, user_email: "membro@exemplo.com", role: "member" }
    ];
  }
}

export class Workflow {
  static async list() {
    return [
      { id: 1, name: "Automação Email", description: "Workflow para emails automáticos" },
      { id: 2, name: "Processamento de Dados", description: "Workflow para processar dados" }
    ];
  }
}

export class Automation {
  static async list() {
    return [
      { id: 1, name: "Auto-resposta", description: "Resposta automática para emails" },
      { id: 2, name: "Backup Diário", description: "Backup automático diário" }
    ];
  }
}

export class Snippet {
  static async list() {
    return [
      { id: 1, title: "Função útil", code: "function exemplo() { return 'Hello World'; }", language: "javascript" },
      { id: 2, title: "Query SQL", code: "SELECT * FROM users WHERE active = 1", language: "sql" }
    ];
  }
}

export class Analytics {
  static async getData() {
    return {
      templates: { total: 45, growth: 12 },
      teams: { total: 8, growth: 5 },
      automations: { total: 23, growth: 8 },
      workflows: { total: 12, growth: 3 }
    };
  }
}

export class Workspace {
  static async current() {
    return {
      id: 1,
      name: "Workspace Principal",
      description: "Workspace principal do usuário"
    };
  }
}
