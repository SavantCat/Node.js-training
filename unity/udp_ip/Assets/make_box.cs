using UnityEngine;
using System.Collections;

public class make_box : MonoBehaviour {

	public GameObject obj;
	public int num;
	public int n=0;
	public float offset = 0;
	// Use this for initialization
	void Start () {
		for(int y=0;y<num;y++){
			for(int x=0;x<num;x++){
				GameObject clone = (GameObject)Instantiate(obj);
				clone.transform.parent = transform;
				clone.transform.position = new Vector3(x,y,0) * offset + transform.position;
				clone.gameObject.name = n+"";
				n++;
			}
		}
	}
}
