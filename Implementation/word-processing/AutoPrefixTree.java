import java.io.*;

public class AutoPrefixTree {
    public static void main(String[] args) {
        try (BufferedWriter bw = new BufferedWriter(new FileWriter("../SP/js/output.js"))) {

            String source = "const populateTrie = function(){\n"+
                            "    var tree = new PrefixTree();\n\n";
            bw.write(source);
            String line = "";
            try (BufferedReader br = new BufferedReader(new FileReader("words_alpha.txt"))) {
                while((line = br.readLine()) != null){
                    // source = source + "    tree.insert(\""+ line +"\");\n";
                    // System.out.println(line);
                    bw.write("    tree.insert(\""+ line +"\");\n");
                }
            }
            catch (IOException ioe) {
                System.out.println("File not found!");
            }
            source = "\n" +
                     "    chrome.storage.local.set({ \"prefixTree\" : tree });\n" +
                     "}\n\npopulateTrie();";
            bw.write(source);
        }
        catch (IOException ioe) {
            System.out.println("File not found!");
        }
    }
}
