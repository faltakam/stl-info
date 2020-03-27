import * as THREE from 'three';
import STLLoader from './STLLoader';

function signedVolumeOfTriangle(p1, p2, p3) {
  return p1.dot(p2.cross(p3)) / 6.0;
}

function getVolume (geometry) {
  let position = geometry.attributes.position;
  let faces = position.count / 3;
  let sum = 0;
  let p1 = new THREE.Vector3(),
    p2 = new THREE.Vector3(),
    p3 = new THREE.Vector3();
  for (let i = 0; i < faces; i++) {
    p1.fromBufferAttribute(position, i * 3 + 0);
    p2.fromBufferAttribute(position, i * 3 + 1);
    p3.fromBufferAttribute(position, i * 3 + 2);
    sum += signedVolumeOfTriangle(p1, p2, p3);
  }
  return sum;
} 

function getSize(geometry) {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const x = box.max.x - box.min.x;
  const y = box.max.y - box.min.y;
  const z = box.max.z - box.min.z;

  return {
    x, y, z
  }
}

function load(src) {
  const loader = new STLLoader();
  return new Promise(function(resolve, reject) {
    loader.load(src, function(geometry) {
      return {
        volume: getVolume(geometry),
        size: getSize(geometry)
      }
    }, null, function(e) {
      reject(e);
    })
  }
);
