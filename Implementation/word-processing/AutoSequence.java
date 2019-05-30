import java.io.*;
import java.util.regex.*;

public class AutoSequence {
    public static void main(String[] args) {
        Pattern p = Pattern.compile("[.\\,!@#\\$\\%\\^&\\*\\(\\)/\\?;:'\"\\[\\]\\{\\}\\|\\-_=+`~]");
        Pattern p2 = Pattern.compile("[ ]+");

        try (BufferedWriter bw = new BufferedWriter(new FileWriter("../SP/js/populatedSequence.js"))) {
            StringBuilder source = new StringBuilder("var populatedSequence = [");
            String line = "";
            try (BufferedReader br = new BufferedReader(new FileReader("hp1.txt"))) {
                while((line = br.readLine()) != null){
                    // bw.write("tree.insert(\""+ line +"\");\n");
                    Matcher m = p.matcher(line);
                    String s1 = m.replaceAll("");
                    Matcher m2 = p2.matcher(s1);
                    String s2 = m2.replaceAll(" ");
                    String[] words = s2.split(" ");
                    for(String word : words) {
                        if(word != "") {
                            source.append("\""+word.toLowerCase()+"\",");
                        }
                    }
                }
            }
            catch (IOException ioe) {
                System.out.println("File not found!");
            }
            bw.write(source.substring(0, source.length()-1)+"];");
        }
        catch (IOException ioe) {
            System.out.println("File not found!");
        }
    }
}
