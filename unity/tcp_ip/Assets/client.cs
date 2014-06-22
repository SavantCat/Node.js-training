using UnityEngine;
using System.Collections;
using System.Threading;
using System.Net.Sockets;
using System.Net;
using System.Text.RegularExpressions;
using System.Text;

using MiniJSON;
using System.Collections.Generic;

public class client : MonoBehaviour {
	//TCP/IPの設定
	public string IPAddress;
	public int    port;
	private TcpClient 		tcpip = null;
	private NetworkStream 	net   = null;

	//ストリーム
	public  string stream = "";
	private byte[] data = new byte[10000];
	
	//Jsonデータ
	private string json;
	private string status;
	private string obj_name;
	public Vector3 pos;
	public Vector3 rote;

	//マルチスレッド用
	private Thread read_thread;

	//一時保存変数
	private Vector3 tmp_p;
	private Vector3 tmp_r;

	public bool send = true;
	public bool read = true;
	
	private void read_stream(){//**マルチスレッド関数**
		Debug.Log("Start read stream!");
		while(true){
			//マルチスレッドの速度？
			Thread.Sleep(0);
			//ストリームの受信
			data = new byte[data.Length];
			//stream = "";
			net.Read(data, 0, data.Length);
			stream = System.Text.Encoding.Default.GetString(data);
			Debug.Log(stream);
			var jsonData = MiniJSON.Json.Deserialize(stream) as Dictionary<string,object>;
			read = false;
			if(jsonData != null){
				read = true;
				pos = new Vector3(float.Parse(jsonData["x_p"].ToString()),float.Parse(jsonData["y_p"].ToString()),float.Parse(jsonData["z_p"].ToString()));
				rote = new Vector3(float.Parse(jsonData["x_r"].ToString()),float.Parse(jsonData["y_r"].ToString()),float.Parse(jsonData["z_r"].ToString()));
			}else{
				Debug.Log("Not Json");
			}
		}
	}

	private bool initialize_cilent(){
		//TCP/IPの初期化
		tcpip = new TcpClient(IPAddress,port);
		if (tcpip == null) {
			Debug.Log("Connect fall.");
			return false;
		} else {
			Debug.Log("Connect success.");
			net = tcpip.GetStream();
			if(net == null){
				Debug.Log("Get stream fall.");
				return false;
			}else{
				return true;
			}
		}
	}

	private void close_cilent(){
		if (net != null && tcpip != null) {
			net.Close ();
			tcpip.Close ();
		} else {
			Debug.Log("Error");
		}
	}

	private void initialize_thread(){
		read_thread = new Thread(new ThreadStart(read_stream));
		if (read_thread == null) {
			Debug.Log ("Error");
		} else {
			read_thread.Start();
		}
	}

	private void close_thread(){
		if (read_thread != null) {
			read_thread.Abort(); 
		} else {
			Debug.Log("Error");
		}
	}

	private void send_massage(string text){
		if (net != null) {
			byte[] send_byte = Encoding.UTF8.GetBytes (text);
			net.Write (send_byte, 0, send_byte.Length);
		} else {
			Debug.Log("Get stream fall.");
		}
	}
	
	private string make_json(string status_mode){
		json = "{" +	"\"type\":\"" + status_mode + 		"\"," +
						"\"name\":\"" + gameObject.name + 	"\"";
		switch (status_mode){
			case "setup":
				status = "send";
				break;
			case "send":
				json += ",";
				json +=	"\"x_p\":" + transform.position.x + 	"," +
						"\"y_p\":" + transform.position.y + 	"," +
						"\"z_p\":" + transform.position.z + 	"," +
						"\"x_r\":" + transform.eulerAngles.x + 	"," +
						"\"y_r\":" + transform.eulerAngles.y + 	"," +
						"\"z_r\":" + transform.eulerAngles.z;
				break;
		}
		json += "}";

		//Debug.Log(json);
		return json;
	}

	// Use this for initialization
	void Awake () {
		status = "setup";
		obj_name = gameObject.name;
		tmp_p = transform.position;
		tmp_r = transform.eulerAngles;

		initialize_cilent();
		initialize_thread();
	}
	
	void Start(){
		//send_massage(gameObject.name);
	}
	
	// Update is called once per frame
	void Update () {
		if (transform.position != tmp_p || transform.eulerAngles != tmp_r) {
			tmp_p = transform.position;
			tmp_r = transform.eulerAngles;
			//if(read == true){
				send_massage(make_json(status));
			//}else{
				pos = tmp_p;
				rote = tmp_r;
			//}
		} 

		transform.position = pos;
		transform.eulerAngles = rote;
	}
	
	void OnApplicationQuit() {
		close_thread ();
		close_cilent ();
		Debug.Log("exit");
	}
}
