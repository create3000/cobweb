
define ([
	"jquery",
	"cobweb/Fields",
	"cobweb/Basic/X3DBaseNode",
	"cobweb/Components/Geometry3D/IndexedFaceSet",
	"cobweb/Components/Rendering/Coordinate",
	"cobweb/Components/Texturing/TextureCoordinate",
	"standard/Math/Numbers/Complex",
	"standard/Math/Numbers/Vector2",
	"standard/Math/Numbers/Vector3",
],
function ($,
          Fields,
          X3DBaseNode,
          IndexedFaceSet,
          Coordinate,
          TextureCoordinate,
          Complex,
          Vector2,
          Vector3)
{
"use strict";
	
	function QuadSphereOptions (executionContext)
	{
		X3DBaseNode .call (this, executionContext .getBrowser (), executionContext);

		this .addChildren ("uDimension", new Fields .SFInt32 (32),
		                   "vDimension", new Fields .SFInt32 (16))
	}

	QuadSphereOptions .prototype = $.extend (Object .create (X3DBaseNode .prototype),
	{
		constructor: QuadSphereOptions,
		getTypeName: function ()
		{
			return "QuadSphereOptions";
		},
		getComponentName: function ()
		{
			return "Cobweb";
		},
		getContainerField: function ()
		{
			return "quadSphereOptions";
		},
		initialize: function ()
		{
			X3DBaseNode .prototype .initialize .call (this);

			this .addInterest (this, "eventsProcessed");
		},
		getGeometry: function ()
		{
			if (! this .geometry)
				this .eventsProcessed ();
			
			return this .geometry;
		},
		createTexCoordIndex: function ()
		{
			var
				uDimension    = this .uDimension_ .getValue () + 1,
				vDimension    = this .vDimension_ .getValue () + 1,
				texCoordIndex = this .geometry .texCoordIndex_;

			// North pole
			
			for (var u = 0, uLength = uDimension - 1; u < uLength; ++ u)
			{
				texCoordIndex .push (u);
				texCoordIndex .push (u + uDimension - 1);
				texCoordIndex .push (u + uDimension);
				texCoordIndex .push (-1);
			}

			// Sphere segments
			
			for (var p = uDimension - 1, v = 0, vLength = vDimension - 3; v < vLength; ++ v, ++ p)
			{
				for (var u = 0, uLength = uDimension - 1; u < uLength; ++ u, ++ p)
				{
					texCoordIndex .push (p);
					texCoordIndex .push (p + uDimension);
					texCoordIndex .push (p + uDimension + 1);
					texCoordIndex .push (p + 1);
					texCoordIndex .push (-1);
				}
			}
			
			// South pole

			var p = (vDimension - 2) * uDimension - 1;

			for (var u = 0, uLength = uDimension - 1; u < uLength; ++ u, ++ p)
			{
				texCoordIndex .push (p + uDimension);
				texCoordIndex .push (p + 1);
				texCoordIndex .push (p);
				texCoordIndex .push (-1)
			}
		},
		createTexCoord: function ()
		{
			var
				uDimension = this .uDimension_ .getValue () + 1,
				vDimension = this .vDimension_ .getValue () + 1,
				point      = this .geometry .texCoord_ .getValue () .point_;

				var
					poleOffset = -0.5 / (uDimension - 1),
					i          = 0;

				// North pole
				
				for (var u = 1; u < uDimension; ++ u)
				{
					var x = u / (uDimension - 1) + poleOffset;
					
					point .push (new Vector2 (x, 1));
				}

				// Sphere segments
				
				for (var v = 1, vLength = vDimension - 1; v < vLength; ++ v)
				{
					var y = 1 - v / (vDimension - 1);
					
					for (var u = 0; u < uDimension; ++ u)
					{
						var x = u / (uDimension - 1);
						
						point .push (new Vector2 (x, y));
					}
				}

				// South pole
				
				for (var u = 1; u < uDimension; ++ u)
				{
					var x = u / (uDimension - 1) + poleOffset;
					
					point .push (new Vector2 (x, 0));
				}
		},
		createCoordIndex: function ()
		{
			var
				uDimension = this .uDimension_ .getValue () + 1,
				vDimension = this .vDimension_ .getValue () + 1,
				coordIndex = this .geometry .coordIndex_;

			// North pole
			
			for (var u = 1, uLength = uDimension - 1; u < uLength; ++ u)
			{
				coordIndex .push (0);
				coordIndex .push (u);
				coordIndex .push (u + 1);
				coordIndex .push (-1);
			}

			coordIndex .push (0);
			coordIndex .push (u);
			coordIndex .push (1);
			coordIndex .push (-1);

			// Sphere segments
			
			var p = 1;

			for (var v = 0, vLength = vDimension - 3; v < vLength; ++ v, ++ p)
			{
				for (var u = 0, uLength = uDimension - 2; u < uLength; ++ u, ++ p)
				{
					coordIndex .push (p);
					coordIndex .push (p + uDimension - 1);
					coordIndex .push (p + uDimension);
					coordIndex .push (p + 1);
					coordIndex .push (-1);
				}

				coordIndex .push (p);
				coordIndex .push (p + uDimension - 1);
				coordIndex .push (p + 1);
				coordIndex .push (p - uDimension + 2);
				coordIndex .push (-1);
			}

			// South pole
			
			var last = p + uDimension - 1;

			for (var u = 0, uLength = uDimension - 2; u < uLength; ++ u, ++ p)
			{
				coordIndex .push (last);
				coordIndex .push (p + 1);
				coordIndex .push (p);
				coordIndex .push (-1);
			}

			coordIndex .push (last);
			coordIndex .push (last - uDimension + 1);
			coordIndex .push (p);
			coordIndex .push (-1);
		},
		createPoints: function ()
		{
			var
				uDimension = this .uDimension_ .getValue () + 1,
				vDimension = this .vDimension_ .getValue () + 1,
				point      = this .geometry .coord_ .getValue () .point_;

			// North pole
			point .push (new Vector3 (0, 1, 0));

			// Sphere segments
			for (var v = 1, vLength = vDimension - 1; v < vLength; ++ v)
			{
				var zPlane = Complex .Polar (1, -Math .PI * v / vLength);

				for (var u = 0, uLength = uDimension - 1; u < uLength; ++ u)
				{
					var yPlane = Complex .Polar (zPlane .imag, 2 * Math .PI * u / uLength);

					point .push (new Vector3 (yPlane .imag, zPlane .real, yPlane .real));
				}
			}

			// South pole
			point .push (new Vector3 (0, -1, 0));
		},
		eventsProcessed: function ()
		{
			this .geometry            = new IndexedFaceSet (this .getExecutionContext ());
			this .geometry .texCoord_ = new TextureCoordinate (this .getExecutionContext ());
			this .geometry .coord_    = new Coordinate (this .getExecutionContext ());

			this .createTexCoordIndex ();
			this .createTexCoord ();
			this .createCoordIndex ();
			this .createPoints ();

			var
				geometry = this .geometry,
				texCoord = this .geometry .texCoord_ .getValue (),
				coord    = this .geometry .coord_ .getValue ();

			geometry .creaseAngle_ = Math .PI;

			texCoord .setup ();
			coord    .setup ();
			geometry .setup ();
		},
	});

	return QuadSphereOptions;
});
