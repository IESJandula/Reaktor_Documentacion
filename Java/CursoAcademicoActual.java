import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class CursoAcademicoActual {
    private static final String API_URL = entornoOValor("REAKTOR_API_URL", "https://proadmin.iesjandula.es");
    private static final String PROYECTO = entornoOValor("REAKTOR_PROYECTO", "admin");
    private static final String CLAVE = entornoOValor("REAKTOR_CLAVE", "admin.cursoAcademicoActual");
    private static final Pattern CAMPO_VALOR = Pattern.compile("\\\"valor\\\"\\s*:\\s*\\\"([^\\\"]+)\\\"");

    private CursoAcademicoActual() {
    }

    public static void main(String[] args) throws Exception {
        String jwtGoogle = System.getenv("REAKTOR_GOOGLE_JWT");
        if (jwtGoogle == null || jwtGoogle.isBlank()) {
            throw new IllegalArgumentException(
                "Define la variable de entorno REAKTOR_GOOGLE_JWT con un JWT de Google válido."
            );
        }

        HttpRequest peticion = HttpRequest.newBuilder()
            .uri(URI.create(sinBarraFinal(API_URL) + "/admin/constants"))
            .timeout(Duration.ofSeconds(15))
            .header("Authorization", "Bearer " + jwtGoogle.trim())
            .header("proyecto", PROYECTO)
            .header("clave", CLAVE)
            .GET()
            .build();

        HttpClient cliente = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

        HttpResponse<String> respuesta = cliente.send(
            peticion,
            HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8)
        );

        if (respuesta.statusCode() != 200) {
            throw new IllegalStateException(
                "Reaktor ha respondido con HTTP " + respuesta.statusCode() + ": " + respuesta.body()
            );
        }

        Matcher matcher = CAMPO_VALOR.matcher(respuesta.body());
        if (!matcher.find()) {
            throw new IllegalStateException("La respuesta no contiene el curso académico actual.");
        }

        System.out.println("Curso académico actual: " + matcher.group(1));
    }

    private static String entornoOValor(String nombre, String valorPredeterminado) {
        String valor = System.getenv(nombre);
        return valor == null || valor.isBlank() ? valorPredeterminado : valor;
    }

    private static String sinBarraFinal(String valor) {
        return valor.endsWith("/") ? valor.substring(0, valor.length() - 1) : valor;
    }
}
