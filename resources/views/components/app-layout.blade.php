{{-- resources/views/components/app-layout.blade.php --}}

{{-- This component uses the layouts.app as its base --}}
@extends('layouts.app')

@section('content')
    {{-- Slot for child content --}}
    {{ $slot }}
@endsection
