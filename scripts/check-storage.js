const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://jqrjcnxwdsrojflxtiii.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxcmpjbnh3ZHNyb2pmbHh0aWlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTcwMjEsImV4cCI6MjA2NjY3MzAyMX0.wXxAc1aVH_xF3rbhbGXo2bOy2M5jmmXQnZgEyLcb50U';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkStorage() {
  console.log('🔍 Investigando Storage do Supabase...\n');

  try {
    // 1. Verificar se conseguimos acessar o storage
    console.log('1. Testando acesso ao storage...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log('❌ Erro ao acessar storage:', bucketsError.message);
      console.log('   Código:', bucketsError.code);
      console.log('   Detalhes:', bucketsError.details);
      return;
    }
    
    console.log('✅ Storage acessível!');
    console.log(`   Buckets encontrados: ${buckets.length}\n`);

    // 2. Listar todos os buckets
    console.log('2. Listando todos os buckets:');
    if (buckets.length === 0) {
      console.log('   ❌ Nenhum bucket encontrado');
    } else {
      buckets.forEach((bucket, index) => {
        console.log(`   ${index + 1}. "${bucket.name}"`);
        console.log(`      ID: ${bucket.id}`);
        console.log(`      Público: ${bucket.public ? 'Sim' : 'Não'}`);
        console.log(`      Criado em: ${bucket.created_at}`);
        console.log(`      Atualizado em: ${bucket.updated_at}`);
        console.log('');
      });
    }

    // 3. Verificar especificamente o bucket task-images
    console.log('3. Verificando bucket "task-images":');
    const taskImagesBucket = buckets.find(bucket => bucket.name === 'task-images');
    
    if (taskImagesBucket) {
      console.log('   ✅ Bucket "task-images" encontrado!');
      console.log(`      ID: ${taskImagesBucket.id}`);
      console.log(`      Público: ${taskImagesBucket.public ? 'Sim' : 'Não'}`);
      console.log(`      Criado em: ${taskImagesBucket.created_at}`);
      
      // 4. Tentar listar arquivos no bucket
      console.log('\n4. Verificando arquivos no bucket:');
      const { data: files, error: filesError } = await supabase.storage
        .from('task-images')
        .list();
      
      if (filesError) {
        console.log('   ❌ Erro ao listar arquivos:', filesError.message);
      } else {
        console.log(`   ✅ ${files.length} arquivos encontrados`);
        if (files.length > 0) {
          files.slice(0, 5).forEach((file, index) => {
            console.log(`      ${index + 1}. ${file.name} (${file.metadata?.size || 'N/A'} bytes)`);
          });
        }
      }
    } else {
      console.log('   ❌ Bucket "task-images" NÃO encontrado');
      console.log('   💡 Sugestões:');
      console.log('      - Verifique se o bucket foi criado corretamente');
      console.log('      - Verifique se o nome está exatamente como "task-images"');
      console.log('      - Verifique se você tem permissões para ver o bucket');
    }

    // 5. Verificar políticas de storage
    console.log('\n5. Verificando políticas de storage...');
    try {
      // Tentar criar um arquivo de teste para verificar políticas
      const testFileName = `test-${Date.now()}.txt`;
      const testContent = 'Teste de upload';
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('task-images')
        .upload(testFileName, testContent, {
          contentType: 'text/plain'
        });
      
      if (uploadError) {
        console.log('   ❌ Erro ao fazer upload de teste:', uploadError.message);
        console.log('   💡 Isso pode indicar problemas com políticas de segurança');
      } else {
        console.log('   ✅ Upload de teste bem-sucedido!');
        
        // Deletar o arquivo de teste
        const { error: deleteError } = await supabase.storage
          .from('task-images')
          .remove([testFileName]);
        
        if (deleteError) {
          console.log('   ⚠️ Erro ao deletar arquivo de teste:', deleteError.message);
        } else {
          console.log('   ✅ Arquivo de teste deletado com sucesso');
        }
      }
    } catch (error) {
      console.log('   ❌ Erro ao testar upload:', error.message);
    }

    // 6. Verificar configurações do projeto
    console.log('\n6. Informações do projeto:');
    console.log(`   URL: ${supabaseUrl}`);
    console.log(`   Chave anônima: ${supabaseAnonKey.substring(0, 20)}...`);
    console.log(`   Total de buckets: ${buckets.length}`);

    // 7. Sugestões de solução
    console.log('\n🔧 Sugestões de solução:');
    if (!taskImagesBucket) {
      console.log('   1. Crie o bucket "task-images" no dashboard do Supabase');
      console.log('   2. Configure como público se necessário');
      console.log('   3. Verifique as políticas de segurança');
    } else if (!taskImagesBucket.public) {
      console.log('   1. Configure o bucket como público no dashboard');
      console.log('   2. Ou ajuste as políticas para permitir acesso anônimo');
    } else {
      console.log('   1. O bucket existe e está público');
      console.log('   2. Verifique as políticas de upload/download');
      console.log('   3. Teste o upload manualmente no dashboard');
    }

  } catch (error) {
    console.error('❌ Erro geral na verificação:', error.message);
    console.error('   Stack:', error.stack);
  }
}

// Executar verificação
checkStorage(); 