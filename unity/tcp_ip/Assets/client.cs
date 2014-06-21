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

	public string IPAddress;
	public int    port;

	private TcpClient 		tcpip = null;
	private NetworkStream 	net   = null;

	private  		byte[] 			data 			= new byte[10000];
	public  		string 			stream = "";

	//マルチスレッド用
	private Thread read_thread;

	public float x,y,z = 0;
	public Vector3 pos;
	public Vector3 rote;
	private Vector3 tmp_p;
	private Vector3 tmp_r;

	public bool send = true;
	public bool read = true;
	private string obj_name = "";

	private Vector3 offset;

	public string My_port = null;

	// Use this for initialization
	void Awake () {
		tmp_p = transform.position;
		tmp_r = transform.eulerAngles;

		obj_name = gameObject.name;

		tcpip = new TcpClient(IPAddress,port);
		net = tcpip.GetStream ();
		read_thread = new Thread (new ThreadStart (read_stream));
		read_thread.Start ();


	}

	void Start(){
		offset = transform.position;

		//byte[] send_byte = Encoding.UTF8.GetBytes(gameObject.name);
		//net.Write (send_byte, 0, send_byte.Length);
	}
	
	// Update is called once per frame
	private string json;
	void Update () {
		if (transform.position != tmp_p || transform.eulerAngles != tmp_r) {
			string json = 	"{" +
								"\"Type\":\"" + "send" + "\"," +
								"\"name\":\"" + gameObject.name + "\"," +
								"\"x_p\":" + transform.position.x + "," +
								"\"y_p\":" + transform.position.y + "," +
								"\"z_p\":" + transform.position.z + "," +
								"\"x_r\":" + transform.eulerAngles.x + "," +
								"\"y_r\":" + transform.eulerAngles.y + "," +
								"\"z_r\":" + transform.eulerAngles.z +
							"}";
			byte[] send_byte = Encoding.UTF8.GetBytes (json + "");
			net.Write (send_byte, 0, send_byte.Length);
			//Debug.Log("send" + gameObject.name);

			tmp_p = transform.position;
			tmp_r = transform.eulerAngles;

			//Debug.Log(stream);
		} else if(transform.position == pos){
			transform.position = pos;
			transform.eulerAngles = rote;
		}

		if(Input.GetKeyDown(KeyCode.E)){
			byte[] send_byte = Encoding.UTF8.GetBytes("close");
			net.Write (send_byte, 0, send_byte.Length);
		}
	}

	private void read_stream(){//**マルチスレッド関数**
		while(true){
			//マルチスレッドの速度？
			Thread.Sleep(0);
			//ストリームの受信
			data = new byte[data.Length];
			//stream = "";
			net.Read(data, 0, data.Length);
			stream = System.Text.Encoding.Default.GetString(data);
			if(My_port == null){
				My_port = stream;
			}
			Debug.Log(stream);
			var jsonData = MiniJSON.Json.Deserialize(stream) as Dictionary<string,object>;
			if(jsonData != null){
				read = true;
				pos = new Vector3(float.Parse(jsonData["x_p"].ToString()),float.Parse(jsonData["y_p"].ToString()),float.Parse(jsonData["z_p"].ToString()));
				rote = new Vector3(float.Parse(jsonData["x_r"].ToString()),float.Parse(jsonData["y_r"].ToString()),float.Parse(jsonData["z_r"].ToString()));
			}
		}
	}

	void OnApplicationQuit() {

		read_thread.Abort(); 
		net.Close();
		tcpip.Close ();
	}
}
