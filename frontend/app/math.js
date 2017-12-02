/**
 * Helper class containing Euler mathematics functions, from:
 * http://bl.ocks.org/ivyywang/7c94cb5a3accd9913263
 */
    /**
     * Returns to radians conversion factor
     * @return {number} the factor
     */
    function toRadians() {
        return Math.PI / 180;
    };

    /**
     * Returns to degrees conversion factor
     * @return {number} the factor
     */
    function toDegrees() {
        return 180 / Math.PI;
    };


    /**
     * Helper function: cross product of two vectors v0&v1
     * @param {number} v0 - vector
     * @param {number} v1 - vector
     * @return {number} cross product
     */
    function cross(v0, v1) {
        return [v0[1] * v1[2] - v0[2] * v1[1], v0[2] * v1[0] - v0[0] * v1[2], v0[0] * v1[1] - v0[1] * v1[0]];
    }

    /**
     * Helper function: dot product of two vectors v0&v1
     * @param {number} v0 - vector
     * @param {number} v1 - vector
     * @return {number} cross product
     */
    function dot(v0, v1) {
        let sum = 0;
        for (let i = 0; v0.length > i; ++i) sum += v0[i] * v1[i];
        return sum;
    }

    /**
     * Helper function:
     * This function converts a [lon, lat] coordinates into a [x,y,z] coordinate
     * the [x, y, z] is Cartesian, with origin at lon/lat (0,0) center of the earth
     * @param {pair} coord - lon/lat pair
     * @return {pair} - [x,y,z] pair
     */
    function lonlat2xyz( coord ) {
        const lon = coord[0] * toRadians();
        const lat = coord[1] * toRadians();

        const x = Math.cos(lat) * Math.cos(lon);

        const y = Math.cos(lat) * Math.sin(lon);

        const z = Math.sin(lat);

        return [x, y, z];
    }

    /**
     * Helper function:
     * This function computes a quaternion representation for the rotation between to vectors
     * https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions#Euler_angles_.E2.86.94_Quaternion
     * @param {number} v0 - vector
     * @param {number} v1 - vector
     * @return {number} quaternion
     */
    function quaternion(v0, v1) {
        if (v0 && v1) {
            let w = cross(v0, v1); // vector pendicular to v0 & v1
            let wLen = Math.sqrt(dot(w, w)); // length of w

            if (wLen == 0) {
                return;
            }

            let theta = .5 * Math.acos(Math.max(-1, Math.min(1, dot(v0, v1))));

            let qi = w[2] * Math.sin(theta) / wLen;
            let qj = - w[1] * Math.sin(theta) / wLen;
            let qk = w[0]* Math.sin(theta) / wLen;
            let qr = Math.cos(theta);

            return theta && [qr, qi, qj, qk];
        }
    }

    /**
     * Helper function:
     * This functions converts euler angles to quaternion
     * https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions#Euler_angles_.E2.86.94_Quaternion
     * @param {angles} e = euler angles
     * @return {quaternion} quatornion
     */
    function euler2quat(e) {
        if (!e) {
            return;
        };
        const roll = .5 * e[0] * toRadians();
        const pitch = .5 * e[1] * toRadians();
        const yaw = .5 * e[2] * toRadians();

        const sr = Math.sin(roll);
        const cr = Math.cos(roll);
        const sp = Math.sin(pitch);
        const cp = Math.cos(pitch);
        const sy = Math.sin(yaw);
        const cy = Math.cos(yaw);

        const qi = sr*cp*cy - cr*sp*sy;
        const qj = cr*sp*cy + sr*cp*sy;
        const qk = cr*cp*sy - sr*sp*cy;
        const qr = cr*cp*cy + sr*sp*sy;

        return [qr, qi, qj, qk];
    }

    /**
     * This functions computes a quaternion multiply
     * Geometrically, it means combining two quant rotations
     * http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/arithmetic/index.htm
     * @param {quaternion} q1 - quatornion
     * @param {quaternion} q2 - quatornion
     * @return {quaternion} quatornion
     */
    function quatMultiply(q1, q2) {
        if (!q1 || !q2) {
            return;
        };

        const a = q1[0];
        const b = q1[1];
        const c = q1[2];
        const d = q1[3];
        const e = q2[0];
        const f = q2[1];
        const g = q2[2];
        const h = q2[3];

        return [
        a*e - b*f - c*g - d*h,
        b*e + a*f + c*h - d*g,
        a*g - b*h + c*e + d*f,
        a*h + b*g - c*f + d*e,
        ];
    }

    /**
     * This function computes quaternion to euler angles
     * https://en.wikipedia.org/wiki/Rotation_formalisms_in_three_dimensions#Euler_angles_.E2.86.94_Quaternion
     * @param {quaternion} t - quatornion
     * @return {angles} = euler angles
     */
    function quat2euler(t) {
        if (!t) {
            return;
        };

        return [
                Math.atan2(2 * (t[0] * t[1] + t[2] * t[3]), 1 - 2 * (t[1] * t[1] + t[2] * t[2])) * toDegrees(),
                Math.asin(Math.max(-1, Math.min(1, 2 * (t[0] * t[2] - t[3] * t[1])))) * toDegrees(),
                Math.atan2(2 * (t[0] * t[3] + t[1] * t[2]), 1 - 2 * (t[2] * t[2] + t[3] * t[3])) * toDegrees(),
        ];
    }

    /**
     * This function computes the euler angles when given two vectors, and a rotation
     * This is really the only math function called with d3 code
     * @param {pos} v0 - starting pos in lon/lat, commonly obtained by projection.invert
     * @param {pos} v1 - ending pos in lon/lat, commonly obtained by projection.invert
     * @param {angles} o0 - the projection rotation in euler angles at starting pos (v0),
     * commonly obtained by projection.rotate
     * @return {angles} - euler angles
     */
    function eulerAngles(v0, v1, o0) {
        /*
            The math behind this:
            - first calculate the quaternion rotation between the two vectors, v0 & v1
            - then multiply this rotation onto the original rotation at v0
            - finally convert the resulted quat angle back to euler angles for d3 to rotate
        */

        const t = quatMultiply( euler2quat(o0), quaternion(lonlat2xyz(v0), lonlat2xyz(v1) ) );
        return quat2euler(t);
    }

module.exports = eulerAngles;
