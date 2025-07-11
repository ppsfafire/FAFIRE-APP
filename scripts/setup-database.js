const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://jqrjcnxwdsrojflxtiii.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxcmpjbnh3ZHNyb2pmbHh0aWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTcwMjEsImV4cCI6MjA2NjY3MzAyMX0.wXxAc1aVH_xF3rbhbGXo2bOy2M5jmmXQnZgEyLcb50U';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log('🔍 Verificando configuração do banco de dados...\n');

  try {
    // Testar conexão
    console.log('1. Testando conexão...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log('❌ Erro na conexão:', error.message);
      return;
    }
    
    console.log('✅ Conexão estabelecida com sucesso!\n');

    // Verificar tabelas existentes
    console.log('2. Verificando tabelas existentes...');
    
    // Verificar se a tabela categories existe
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);
    
    if (categoriesError) {
      console.log('❌ Tabela "categories" não encontrada');
      console.log('   Erro:', categoriesError.message);
    } else {
      console.log('✅ Tabela "categories" encontrada');
    }

    // Verificar se a tabela tasks existe
    const { data: tasksData, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .limit(1);
    
    if (tasksError) {
      console.log('❌ Tabela "tasks" não encontrada');
      console.log('   Erro:', tasksError.message);
    } else {
      console.log('✅ Tabela "tasks" encontrada');
    }

    // Verificar storage
    console.log('\n3. Verificando storage...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log('❌ Erro ao verificar storage:', bucketsError.message);
    } else {
      const taskImagesBucket = buckets.find(bucket => bucket.name === 'task-images');
      if (taskImagesBucket) {
        console.log('✅ Bucket "task-images" encontrado');
      } else {
        console.log('❌ Bucket "task-images" não encontrado');
      }
    }

    // Verificar autenticação
    console.log('\n4. Verificando autenticação...');
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Erro na autenticação:', authError.message);
    } else {
      console.log('✅ Autenticação configurada corretamente');
    }

    console.log('\n📊 Resumo da verificação:');
    console.log('========================');
    console.log('URL:', supabaseUrl);
    console.log('Status: Conectado');
    console.log('Tabelas necessárias: Verificar manualmente no dashboard');
    console.log('Storage: Verificar manualmente no dashboard');
    console.log('Autenticação: Configurada');

    console.log('\n🔧 Próximos passos:');
    console.log('1. Acesse o dashboard do Supabase');
    console.log('2. Execute os comandos SQL do arquivo SUPABASE_SETUP.md');
    console.log('3. Configure o bucket de storage se necessário');
    console.log('4. Teste o app com as credenciais configuradas');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar verificação
checkDatabase(); 